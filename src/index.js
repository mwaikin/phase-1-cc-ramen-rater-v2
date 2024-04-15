
function getRamens() {
    fetch("http://localhost:3000/ramens")
        .then(res => res.json())
        .then(ramens => {
            ramens.forEach(ramen => renderRamen(ramen))
            displayRamen(ramens[0])
        })
}

function addFormListener() {
    const newRamenForm = document.getElementById("new-ramen")
    newRamenForm.addEventListener("submit", (e) => submitNewRamen(e))
}

function renderRamen(ramen) {
    const ramenMenu = document.getElementById("ramen-menu")
    const ramenItem = document.createElement("div")
    const ramenImg = document.createElement("img")
    const deleteBtn = document.createElement("button")

    ramenImg.src = ramen.image
    deleteBtn.textContent = "x"
    ramenItem.className = "ramen-item"

    ramenImg.addEventListener("click", () => displayRamen(ramen))
    deleteBtn.addEventListener("click", () => deleteRamen(ramen, ramenItem))

    ramenItem.append(ramenImg)
    ramenItem.append(deleteBtn)
    ramenMenu.append(ramenItem)
}

function displayRamen(ramen) {
    const displayImage = document.getElementById("detail-image")
    const displayName = document.getElementById("name")
    const displayRestaurant = document.getElementById("restaurant")
    const rating = document.getElementById("rating-display")
    const comment = document.getElementById("comment-display")
    const editForm = document.getElementById("edit-ramen")

    displayImage.src = ramen.image
    displayName.textContent = ramen.name
    displayRestaurant.textContent = ramen.restaurant
    rating.textContent = `${ramen.rating}`
    comment.textContent = ramen.comment

    console.log(rating.textContent + " " + comment.textContent)

    editForm.addEventListener("submit", (e) => editDisplayedRamen(e, ramen, rating, comment))
}

function submitNewRamen(e) {
    e.preventDefault()
    const ramenObj = {
        name: e.target.name.value,
        restaurant: e.target.restaurant.value,
        image: e.target.image.value,
        rating: e.target.rating.value,
        comment: e.target["new-comment"].value,
    }

    fetch("http://localhost:3000/ramens", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(ramenObj)
    })
        .then(res => res.json())
        .then(ramen => renderRamen(ramen))



    e.target.reset()
}

function editDisplayedRamen(e, ramen, rating, comment) {
    e.preventDefault()

    const newRating = e.target.rating.value
    const newComment = e.target["new-comment"].value

    fetch(`http://localhost:3000/ramens/${ramen.id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            rating: newRating,
            comment: newComment
        })
    })
        .then(() => {
            rating.textContent = `${newRating}`
            comment.textContent = newComment
        })


    console.log("old:" + rating.textContent + " " + comment.textContent)
    console.log("new:" + newRating + " " + newComment)
}

function deleteRamen(ramen, ramenItem) {
    const rating = document.getElementById("rating-display")
    const comment = document.getElementById("comment-display")

    const placeholderRamen = {
        image: "../assets/image-placeholder.jpg",
        name: `${ramen.name} deleted!`,
        restaurant: "Click a ramen to show its details",
        rating: "",
        comment: ""
    }

    rating.textContent = ""
    comment.textContent = ""

    fetch(`http://localhost:3000/ramens/${ramen.id}`, {
        method: 'DELETE'
    })
        .then(ramenItem.remove())
        .then(() => {
            rating.textContent = ""
            comment.textContent = ""
            displayRamen(placeholderRamen)
        })
}

getRamens()
addFormListener()