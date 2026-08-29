const searchform = document.getElementById('search-form');
const searchinput = document.getElementById('search-input');
const resultscontainer = document.getElementById('results');
const detailModal = document.getElementById('book-detail');
const closeModalBtn = document.getElementById('close-modal-btn');

searchform.addEventListener('submit', (e) => {
    e.preventDefault();
    const info = searchinput.value.trim();
    if(info){
        getBooks(info);
    }
});

async function getBooks(info) {
    resultscontainer.innerHTML = '<p><span>Loading Books...</span></p>';

    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(info)}`);
        const data = await response.json();

        const books = data.docs.slice(0, 5);

        displayBooks(books);
    }
    catch (error) {
        console.error('Error fetching books:', error);
        resultscontainer.innerHTML = '<p> Sorry...This Book is not Available.</p>';
    }
}

function displayBooks(books) {
    resultscontainer.innerHTML = '';
    
    if (books.length === 0) {
        resultscontainer.innerHTML = '<p>No Book Available.</p>';
        return;
    }

    books.forEach((book) => {
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

        // Open modal when card is clicked
        card.addEventListener('click', () => {
            showdetalis({ title, authors, year, about, coverurl });
        }); 

        resultscontainer.appendChild(card);
    });
}

function showdetalis(book) {
    document.getElementById('modal-title').innerText = book.title;
    document.getElementById('modal-author').innerText = book.authors;
    document.getElementById('modal-year').innerText = book.year;
    document.getElementById('modal-about').innerText = book.about;
    document.getElementById('modal-cover').src = book.coverurl;

    
    detailModal.classList.add('active');
}


closeModalBtn.addEventListener('click', () => {
    detailModal.classList.remove('active');
});


detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) {
        detailModal.classList.remove('active');
    }
});