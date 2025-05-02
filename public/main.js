var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var thumbDown = document.getElementsByClassName("fa-thumbs-down"); //can be renamed to fa-trash-o and in the profile.ejs instead of targeting the pseudo selector
var trash = document.getElementsByClassName("fa-trash");

Array.from(thumbUp).forEach(function(element) {  //I think node list needs to be made into an Array
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(thumbDown).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('down', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp':thumbUp
      })
    })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});

document.getElementById("quizForm").addEventListener("click", function() {
  // event.preventDefault(); // Prevent refresh

  var points = document.querySelector('.points').innerText
  console.log(points)

  const selectedOption = document.querySelector('input[name="choice"]:checked');
  if (!selectedOption) {
      alert("Please select an answer!");
      return;
  }

  const correctAnswer = "south-africa";
  const username = document.getElementById("user-email").textContent

 fetch("/update-score", { //sending the request
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, isCorrect: selectedOption.value === correctAnswer, score: points}),
  });

  alert(selectedOption.value === correctAnswer ? "Correct!" : "Wrong answer!");
  window.location.reload(); // Reload to get updated score from the server
});


// let score = 0;
// const correctAnswer = "south-africa"; // Define the correct answer

// document.getElementById("quizForm").addEventListener("submit", function(event) {
//     event.preventDefault(); // Prevent page reload

//     const selected = document.querySelector('input[name="choice"]:checked'); // Get selected option
//     if (!selected) {
//         alert("Please select an answer!");
//         return;
//     }

//     if (selected.value === correctAnswer) {
//         score++;
//         localStorage.setItem("score", score); // Save score locally
//         document.getElementById("score").textContent = score;
//     }

//     alert(selected.value === correctAnswer ? "Correct!" : "Wrong answer!");
// });


document.querySelectorAll(".delete-btn").forEach((button) => {
  button.addEventListener("click", function() {
      const username = this.getAttribute("data-username");
      const capital = this.getAttribute("data-capital");

      fetch("/delete-capital", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, capital }),
      })
      .then(function (response) {
        window.location.reload()
      })
  });
});