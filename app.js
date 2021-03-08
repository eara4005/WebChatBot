
(function() {

  var key;
  var random = Math.floor(Math.random()*25);
  var botui = new BotUI('web-chatbot');

  //初期メッセージ．
  botui.message.add({
    content: 'こんにちは！'
  }).then(showQuestions);


  // 質問の選択肢を提示する関数．
  function showQuestions() {
    botui.message.add({
      delay:1500,
      content: '聞きたいことは何ですか？'
    }).then(function() {

      // ボタンを提示する．
      return botui.action.button({
        autoHide: false,
        delay: 1500,
        action: [
          {icon: 'google', text: 'Google検索', value: 'search'},
          {icon: 'user-o', text: 'おしゃべり', value: 'talk'},
          {icon: 'question', text: 'このサイトの使いかた', value: 'use'}
        ]
      });
    }).then(function(res) {
      botui.action.hide();
      switch (res.value) {
        case 'search': showSearch(); break;
        case 'talk': showTalk(); break;
        case 'goHome': gotoHome();break;
        case 'use': showUse(); break;
        default: end();
      }
    });
  }

  //検索ボタンの処理
  function showSearch() {
    botui.message.add({
      delay: 1500,
      content: 'Googleを開きます。'
    }).then(function() {
      return botui.message.add({
        loading: true,
        delay: 2500,
        content: location.href='https://www.google.com/'
      });
    }).then(askEnd);
  }

  //雑談ボタンの処理
  function showTalk() {
    botui.message.add({
      delay: 1500,
      content: 'お話しましょう！'
    }).then(function() {
      //キーワードの入力
      //[return]を記述してユーザーからの入力待ちにしておく
      return botui.action.text({
        delay: 1000,
        action:{
          placeholder:'例：こんにちわ'
        }
      });
    }).then(function(res){

      //入力されたキーワードを取得
      key = res.value;
      getkeywords(key);
      
    });
  }

  //取得したキーワードに対する返答
  function getkeywords(keyword){

    if(keyword == 'こんにちは'){
      botui.message.add({
        loading:true,
        delay: 1500,
        content: 'こんにちは！　ユーザーさん'
      }).then(showTalk);
    }   
    else if(keyword == 'こんばんわ'){
      botui.message.add({
        loading: true,
        delay: 1500,
        content: 'お疲れ様です　ユーザーさん'
      }).then(showTalk);
    }
    else if(keyword.match(/寒い/)){
      botui.message.add({
        loading: true,
        delay: 1500,
        content: 'そうですね 暖かいモノが欲しいですね'
      }).then(showTalk);
    }
    else if(keyword.match(/暑い/)){
      botui.message.add({
        loading: true,
        delay: 1500,
        content: 'そうですね　アイス食べたくなりますよね'
      }).then(showTalk);
    }
    else if(keyword.match(/飲みたい/)){
      botui.message.add({
        loading: true,
        delay: 1500,
        content: '水分補給はこまめにしてくださいね'
      }).then(showTalk);
    }
    else if(keyword.match(/食べたい/)){
      botui.message.add({
        loading: true,
        delay: 1500,
        content: '食べすぎには注意してくださいね'
      }).then(showTalk);
    }
    else if(keyword.match(/嫌い/)){
      botui.message.add({
        loading: true,
        delay: 1500,
        content: '頑張って克服しましょう！'
      }).then(showTalk);
    }
    else if(keyword.match(/ありがとう/)){
      botui.message.add({
        loading: true,
        delay: 1500,
        content: 'いえいえ'
      }).then(showTalk);
    }
    else if(keyword.match(/天気は/)){
      botui.message.add({
        loading: true,
        delay: 1500,
        content: '空までいって確認してきます！'
      }).then(showTalk);
    }
    else if (keyword.match(/音楽/)){
      botui.message.add({
        loading:true,
        delay:1500,
        content: 'いい音楽ならここにたくさんあるはずです！'
      }).then(function(res){
        return botui.message.add({
          loading:true,
          delay:1500,
          content: location.href = 'https://soundcloud.com/'
        });
      }).then(showTalk);
    }
    else if(keyword.match(/終了/)){
        botui.message.add({
          delay: 1500,
          content: 'わかりました。選択画面にもどります～'
        }).then(showQuestions);
    }
    else{
      botui.message.add({
        loading:true,
        delay:1500,
        content: 'ごめんなさい　よくわかりません'
      }).then(showTalk);
    }
  }


  // ウェブサイトについての説明
  function showUse() {
    botui.message.add({
      delay: 1500,
      content: 'このサイトは、チャットボットと会話しながら'
    }).then(function(){
      return botui.message.add({
        delay: 2000,
        content: '検索ボタンでグーグル先生を召喚したり、'
      });
    }).then(function(){
      return botui.message.add({
        delay: 2000,
        content: '雑談ボタンで私とお話できちゃいます＾＾'
      })
    }).then(askEnd);
  }


  // プログラムを終了するか聞く
  function askEnd(){
    botui.message.add({
      delay:2000,
      content: 'ほかに聞きたいことはないですか？'
    }).then(function() {

      // ボタンを提示する．
      return botui.action.button({
        delay: 1500,
        action: [
          {text: 'ある', value: true},
          {text: 'ない', value: false}
        ]
      });
    }).then(function(res) {
      res.value ? showQuestions() : end();
      });
  }


  //プログラムを終了する
  function end() {
    botui.message.add({
      delay: 1500,
      content: 'またお会いしましょう！'
    });
  }

})();