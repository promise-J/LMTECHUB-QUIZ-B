function inviteTemplate(quizId, title) {
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
      <h1>LMTechub</h1>
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgVmB1-lPkxw5s0sb5nXu_blLQs7fO2PDvq_GF1feBuBwR1SI7bJl1YwUAIDuiLVoK5zE&usqp=CAU" alt="invited">
      <h1>${title} quiz invitation</h1>
      <h2>You have been invited to join take this quiz.</h2>
      <a href="http://localhost:5173/getting-started?quizId=${quizId}">Click here to write this test</a><br />
      <a href="mailto:chiemelapromise30@gmail.com">Please contact the admin for further questions</a>
    </div>
  </body>
</html>

`;
  return emailHtml;
}

export default inviteTemplate;
