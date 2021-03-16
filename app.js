
(function() {

  var key;
  var delayTime = 1500;
  var random = Math.floor(Math.random()*25);
  var botui = new BotUI('web-chatbot');

  //初期メッセージ．
  botui.message.add({
    content: 'こんにちは！chatbotAPPへようこそ！'
  }).then(showQuestions);


  // 質問の選択肢を提示する関数．
  function showQuestions() {
    botui.message.add({
      delay:delayTime,
      content: 'やりたいことはなんですか？'
    }).then(function() {

      // ボタンを提示する．
      return botui.action.button({
        autoHide: false,
        delay: delayTime,
        action: [
          {icon: 'google', text: 'Google検索', value: 'search'},
          {icon: 'user-o', text: 'おしゃべり', value: 'talk'},
          {icon: 'question', text: 'このサイトの使いかた', value: 'use'},
          {icon: '',text: '終了',value: 'exit'},
        ]
      });
    }).then(function(res) {
      botui.action.hide();
      switch (res.value) {
        case 'search': showSearch(); break;
        case 'talk': showTalk(); break;
        case 'use': showUse(); break;
        case 'exit': end();break;
        default: end();
      }
    });
  }

  //検索ボタンの処理
  function showSearch() {
    botui.message.add({
      delay: delayTime,
      content: 'Googleを開きます。'
    }).then(function() {
      return botui.message.add({
        loading: true,
        delay: delayTime,
        content: location.href='https://www.google.com/'
      });
    }).then(askEnd);
  }

  //雑談ボタンの処理
  function showTalk() {
    botui.message.add({
      delay: delayTime,
      content: 'お話しましょう！'
    }).then(function(){
      return botui.message.add({
        delay: delayTime,
        content: '戻りたいときは「終了」とおっしゃってください！'
      });
    }).then(askForBot);
  }

  function askForBot(){
    //キーワードの入力
    //[return]を記述してユーザーからの入力待ちにしておく
    botui.action.text({
      delay: delayTime,
      action:{
          placeholder:'例：こんにちわ'
      }
    })
    .then(function(res){
      //入力されたキーワードを取得
      key = res.value;
      getkeywords(key); 
    });
  }

  //取得したキーワードに対する返答
  function getkeywords(keyword){
    let formdata = new FormData();
    formdata.append('apikey','DZZiFxcgCS6S3qKp5os9yu6B4fcBbZro');
    formdata.append('query',keyword);

    // 会話を終了
    if(keyword.match(/終了/)){
      botui.message.add({
        delay: delayTime,
        content: 'わかりました。選択画面にもどります'
      }).then(showQuestions);

    // その他のキーワード => APIのレスポンスをメッセージにする
    } else {
      fetch('https://api.a3rt.recruit-tech.co.jp/talk/v1/smalltalk',{
        method: 'post',
        body: formdata,
      }).then(response =>{
        response.json().then(data =>{

          var rep= data.results[0].reply;

          botui.message.add({
            loading:true,
            delay: delayTime,
            content: rep,
          }).then(askForBot);
        });
      });
    }
  }

  // ウェブサイトについての説明
  function showUse() {
    botui.message.add({
      delay: delayTime,
      content: 'このWEBアプリは'
    }).then(function(){
      return botui.message.add({
        delay: delayTime,
        content: '検索ボタンでグーグル検索をしたり、'
      });
    }).then(function(){
      return botui.message.add({
        delay: delayTime,
        content: '雑談ボタンでチャットボットとお話できちゃいます'
      })
    }).then(showQuestions);
  }

  //プログラムを終了する
  function end() {
    botui.message.add({
      delay: 1500,
      content: 'またお会いしましょう！',
    });
  }

})();