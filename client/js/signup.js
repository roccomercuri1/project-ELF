document.querySelector('.signup_form').addEventListener('submit', register_event)


async function register_event (e){
    
    e.preventDefault()
    const form = new FormData(e.target)
    const options = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: form.get('name'),
            email: form.get('email'),
            username: form.get('username'),
            password: form.get('password')
        })
    }
    const response = await fetch ('http://localhost:3000/user/register', options)

    const data = await response.json()

    const userStatsOptions = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: form.get('username'),
            userid: data.userid
        })
    }
    console.log(form.get('username'));
    const userStatsResponse = await fetch('http://localhost:3000/userstats', userStatsOptions)

    const userStatsData = await userStatsResponse.json()


    if (response.status === 201){
        window.location.assign('index.html')
        alert('Successfully Registered')
    }else{
        alert(data.error)
    }
}
