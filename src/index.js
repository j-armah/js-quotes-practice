const body = document.body
let quoteArray = []
const quoteForm = document.querySelector("#new-quote-form")
const quoteList = document.querySelector("#quote-list")

function renderQuotes() {
    fetch("http://localhost:3000/quotes?_embed=likes")
        .then(resp => resp.json())
        .then(data => {
            quoteArray = data
            //console.log(data)
            renderOneQuote(quoteArray)
        })
}

function renderOneQuote (quotes) {
    quotes.forEach(quote => createQuote(quote))
}

function createQuote(quote) {
    //let quoteList = document.querySelector("#quote-list")
    let likesCount = 0
    if (quote.likes) {
        likesCount = quote.likes.length
    }

    let li = document.createElement("li")
        li.classList.add("quote-card")
        li.dataset.id = quote.id
    let blockquote = document.createElement("blockquote")
        blockquote.classList.add("blockquote")
    let p = document.createElement("p")
        p.classList.add("mb-0")
        p.textContent = quote.quote
    let footer = document.createElement("footer")
        footer.classList.add("blockquote-footer")
        footer.textContent = quote.author
    let br = document.createElement("br")
    let button1 = document.createElement("button")
        button1.classList.add("btn-success")
        button1.dataset.id = quote.id
        button1.textContent = `Likes: ${likesCount}`
    let button2 = document.createElement("button")
        button2.classList.add("btn-danger")
        button2.textContent = "Delete"

    blockquote.append(p, footer, br, button1, button2)
    li.append(blockquote)
    quoteList.append(li)
}

// function refreshLikes(newLikeObj) {
//     let likeId = newLikeObj.quoteId
//     let likeButton = document.querySelector(`button[data-id='${likeId}']`)
//     let quoteLikes = quoteArray.find(element => element.id === likeId).likes.length
//     //console.log(quoteLikes)
//     quoteLikes += 1

//     likeButton.textContent = `Likes: ${quoteLikes}`

// }

quoteForm.addEventListener("submit", event => {
    event.preventDefault()
    //console.log(event)
    newQuoteObj = {
        quote : quoteForm.quote.value,
        author : quoteForm.author.value,
        //likes : []
    }

    fetch("http://localhost:3000/quotes?_embed=likes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newQuoteObj)
    })
    .then(resp => resp.json())
    .then(newObj => {
        createQuote(newObj)
    })
    //event.target.reset()
})

quoteList.addEventListener("click", event => {
    if (event.target.matches(".btn-danger")) {
        let quoteId = event.target.closest("li").dataset.id
        //console.log(quoteId)
        fetch(`http://localhost:3000/quotes/${quoteId}?_embed=likes`, {
            method: "DELETE"
        })
    deletion = document.querySelector(`li[data-id='${quoteId}']`)
    //console.log(deletion)
    deletion.remove()
    }

    else if (event.target.matches(".btn-success")) {
        let currentQuoteId = parseInt(event.target.closest("li").dataset.id)

        let newLikeObj = {
            quoteId : currentQuoteId,
            createdAt : Date.now()
        }

        fetch("http://localhost:3000/likes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(newLikeObj)
        }) 
        .then(resp => resp.json())
        .then(data => {
            //console.log("Liked")
            //refreshLikes(data)
            let button = event.target
            button.textContent = `Likes: ${parseInt(button.textContent.slice(7)) + 1}`
        })
    }
})

renderQuotes()