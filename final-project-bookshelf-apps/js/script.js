const books = [];
const RENDER_EVENT = 'render-books'
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateBookShelfObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}
document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {

    event.preventDefault();
    mySnackbar("add")
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});


document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
  const uncompletedBookshelfList = document.getElementById('incompleteBookshelfList');
  uncompletedBookshelfList.innerHTML = '';
  const completedBookshelfList = document.getElementById('completeBookshelfList');
  completedBookshelfList.innerHTML = '';
  for (const BookshelfItem of books) {
    const BookshelfElement = makeBookShelf(BookshelfItem);
    if (!BookshelfItem.isCompleted) {
      uncompletedBookshelfList.append(BookshelfElement);

    }
    else

      completedBookshelfList.append(BookshelfElement);

  }
});
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
inputBookIsComplete.addEventListener("click", () => {

  const submitForm = document.getElementById('span');
  if (submitForm.innerText === "Belum selesai dibaca") {
    submitForm.innerText = "Selesai dibaca";
  } else {
    submitForm.innerText = "Belum selesai dibaca";
  }
});

document.getElementById("searchSubmit").addEventListener("click", function (event) {
  event.preventDefault();

  const searchBook = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookList = document.querySelectorAll(".inner h3");
  for (const book of bookList) {
    if (book.innerText.toLowerCase().includes(searchBook)) {
      book.parentElement.parentElement.style.display = "block";
    } else {
      book.parentElement.parentElement.style.display = "none";
    }
  }
});

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  var bookComplete = document.getElementById('inputBookIsComplete');

  console.log(bookComplete);

  if (bookComplete.checked) {
    bookComplete = true;
  } else {
    bookComplete = false;
  }

  const generatedID = generateId();
  const bookObject = generateBookShelfObject(generatedID, bookTitle, bookAuthor, bookYear, bookComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function generateId() {
  return +new Date();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}
function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT)); saveData();
}


function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT)); saveData();
}
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    } makeBookShelf
  }
  return null;
}

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
function mySnackbar(action) {
  var x = document.getElementById("snackbar");
  if (action === 'remove') {
    x.innerText = "Buku telah dihapus";
  } else {
    x.innerText = "Buku baru telah ditambahkan"
  }
  x.className = "show";
  setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

function makeBookShelf(bookObject) {
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = 'Penulis: ' + bookObject.author;

  const bookYear = document.createElement('p');
  bookYear.innerText = 'Tahun: ' + bookObject.year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(bookTitle, bookAuthor, bookYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');

    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id);

      mySnackbar("remove");
    });

    container.append(undoButton, trashButton);
  } else {
    
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(bookObject.id);

      mySnackbar("remove");
    });

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');

    checkButton.addEventListener('click', function () {
      addBookToCompleted(bookObject.id);
    });

    container.append(checkButton, trashButton);
  }
  return container;
}