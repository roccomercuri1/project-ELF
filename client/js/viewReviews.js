
async function getReviews(){
    try{
        const response = await fetch(`http://localhost:3000/reviews`)
        const reviews = await response.json();

        console.log(reviews)
        const container = document.getElementById('reviewscontainer')
        container.innerHTML = `Loading reviews.. `
        container.innerHTML = ``

        console.log(reviews[0])

        reviews.forEach(review => {
            const reviewbox = document.createElement('div');
            reviewbox.className = "reviewbox"

            //fetch reviewtitle and contents+date
            reviewbox.innerHTML = `<h3>${review.reviewtitle}</h3> 
            <p>${review.reviewcontents} ${new Date(review.reviewdate).toLocaleDateString()}</p>`;

//Might need to do a loop to add the skills??.... 
//also need to add styling - right now it's jsut text
        container.appendChild(reviewbox)
        })
    } catch (err) {
        document.getElementById('reviewscontainer').textContent = 'Failed to get reviews'
        console.log('Error loading reviews')
    }
}

getReviews();