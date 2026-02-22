fetch("http://localhost:8000/predict-risk", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "quiz_scores": 80,
    "test_scores": 85,
    "maths_score": 75,
    "reading": 90,
    "writing": 80,
    "time_spent": 5,
    "communication": 85
  })
}).then(res => res.json()).then(console.log).catch(console.error);
