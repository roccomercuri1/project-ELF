document
  .querySelector(".signup_form")
  .addEventListener("submit", register_event);

async function register_event(e) {
  e.preventDefault();
  const form = new FormData(e.target);
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isadmin: form.get("isadmin") === "true",
      firstname: form.get("firstname"),
      email: form.get("email"),
      username: form.get("username"),
      userpassword: form.get("userpassword"),
    }),
  };
  const response = await fetch("http://localhost:3000/user/register", options);

  const data = await response.json();

  const userStatsOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: form.get("username"),
      userid: data.userid,
    }),
  };
  console.log(form.get("username"));
  const userStatsResponse = await fetch(
    "http://localhost:3000/userstats",
    userStatsOptions
  );

  const userStatsData = await userStatsResponse.json();

  if (response.status === 201) {
    alert("Successfully Registered");
    e.target.reset();
    window.location.assign("login.html");
  } else {
    alert(data.error);
  }
}
