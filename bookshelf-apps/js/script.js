const books = [];
const RENDER_EVENT = 'render-books'
const SAVED_EVENT = 'saved-books';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateBookShelfObject(id, title,author, year, isCompleted) {
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
  mySnackbar()
  // alert('Kegiatan baru telah ditambahkan');
});

function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookTitle').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const bookComplete = document.getElementById('inputBookIsComplete').value;
  
    const generatedID = generateId();
    const bookObject = generateBookShelfObject(generatedID, bookTitle,bookAuthor, bookYear, bookComplete);
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
  function mySnackbar() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }
  function makeBookShelf(bookObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.task;
  
    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = bookObject.timestamp;
  
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);
  
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
      });
  
      container.append(undoButton, trashButton);
    } else {
      const checkButton = document.createElement('button');
      checkButton.classList.add('check-button');
  
      checkButton.addEventListener('click', function () {
        addBookToCompleted(bookObject.id);
      });
  
      container.append(checkButton);
    }
    return container;
  }