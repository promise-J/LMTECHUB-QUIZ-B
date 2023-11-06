function completeQuiz(title) {
    const emailHtml = `
  <html>
    <head>
      <style>
        body{
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
        div{
        }
        img{
          height: 300px;
          margin: auto;
        }
        a{
          font-size: 25px;
        }
        h1{
          color: blue;
          font-size: 40px;
        }
      </style>
    </head>
    <body>
      <div>
        <h1>LMTechub Quiz Completed</h1>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgv8N69DCm-MvBnTTgTEBB0FH84JmCwnk7NQ&usqp=CAU" alt="invited">
        <h1>Congrats on successful Completion of ${title} quiz</h1>
        <h2>You have been invited to join take this quiz.</h2>
        <p>Your result will be out shortly.</p>
        <a href="mailto:chiemelapromise30@gmail.com">Please contact the admin for further questions</a>
      </div>
    </body>
  </html>
  
  `;
    return emailHtml;
  }
  
  export default completeQuiz;
  