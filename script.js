const searchform = document.getElementById('search-form');
const searchinput = document.getElementById('search-input');
const resultscontainer = document.getElementById('results');

searchform.addEventListener('submit', (e) => {
    e.preventDefault();
    const info = searchinput.value.trim();
    if(info){
        getBooks(info);
    }
});

async function getBooks(info) {
    resultscontainer.innerHTML = '<p>Loding Books...</p>';

    try{
        const response = await fetch(` https://openlibrary.org/search.json?q=${encodeURIComponent(info)}`);
        const data = await response.json();

        const books = data.docs.slice(0,3);

        displayBooks(books);
    }
    catch (error){
        console.error('Error fetching books:',error);
        resultscontainer.innerHTML = '<p> Something Went Wrong. Please try again later...</p>';

    }
}

function displayBooks(books){
    resultscontainer.innerHTML = '';
    
    if (books.length === 0){
        resultscontainer.innerHTML = '<p>No Book Available.</p>';
        return;
    }

    books.forEach((book)=>{
        const title = book.title || 'Unknown Title';
        const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
        const year = book.first_publish_year || 'N/A';

        const coverurl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : 'https://via.placeholder.com/128x193?text=No+Cover';


        const about = book.first_sentence
        ? (Array.isArray(book.first_sentence) ? book.first_sentence[0] : book.first_sentence)
        : `Editions available: ${book.edition_count || 'N/A'}`;


        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <img src="${coverurl}" alt="${title} cover" class="book-cover" />
            <div class="book-details">
                <h3>${title}</h3>
                <p><strong>Author:</strong> ${authors}</p>
                <p><strong>Published:</strong> ${year}</p>
                <p class="book-about"><strong>Info:</strong> ${about}</p>
                </div>
                `;

        resultscontainer.appendChild(card);
    });
}

