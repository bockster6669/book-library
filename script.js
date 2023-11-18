const myLibrary = []; // тук съхраняваме списък от книги

// конструктур за книга
let createBook = (() => {
  let functionCallCount = 0;

  return function(author, title, pages, image, isRead=false){
    functionCallCount++;
    let id = functionCallCount;
    return { id, author, title, pages, image, isRead };
  };
})();

function addBookToLibrary(newBook) {
  const place = myLibrary.length;
  myLibrary[place] = newBook;
}

function openModal(){
  const modal = document.querySelector('.modal');
  modal.showModal()
}


function checkImage(url) {
  return new Promise(function(resolve, reject) {
      var img = new Image();
      img.onload = function() {
          resolve(url);
      };
      img.onerror = function() {
          resolve('book1.png');
      };
      img.src = url;
  });
}

function submitForm() {
  const author = document.getElementById("author").value;
  const title = document.getElementById("title").value;
  const pages = document.getElementById("pages").value;
  const image = document.getElementById("image").value;

  checkImage(image)
    .then(function(validImage) {
      const newBook = createBook(author, title, pages, validImage);
      const modal = document.querySelector('dialog');
      addBookToLibrary(newBook);
      createCard(newBook);
      modal.close();
    })
    .catch(function(defaultImage) {
      console.log('Линкът не е валиден, използвам линк по подразбиране: ' + defaultImage);
      const newBook = createBook(author, title, pages, defaultImage);
      const modal = document.querySelector('dialog');
      addBookToLibrary(newBook);
      createCard(newBook);
      modal.close();
  });

  document.getElementById("author").value = "";
  document.getElementById("title").value = "";
  document.getElementById("pages").value = "";
  document.getElementById("image").value = "";
  event.preventDefault();
  
}

function deleteBook(id){
  const index = myLibrary.findIndex(book => book.id === id);
  myLibrary.splice(index, 1);

  $(`.card[id="${id}"]`).remove();
}

function updateStatusRead(bookId, checkbox){
  const bookToUpdate = myLibrary.find(book => book.id === bookId);
  const bookToUpdateDOM = document.getElementById(`readStatus_${bookToUpdate.id}`);

  if (checkbox.checked) {
    bookToUpdate.isRead = true;
    $(bookToUpdateDOM).html(`<strong>IsRead:</strong> ${bookToUpdate.isRead}`);
  } else {
    bookToUpdate.isRead = false;
    $(bookToUpdateDOM).html(`<strong>IsRead:</strong> ${bookToUpdate.isRead}`);
  }
}

function createCard(newBook) {
  const content = $('.content');

  $(`
     <div class="card" id=${newBook.id}>
        <div class="image">
         <img src=${newBook.image} width="100%" height="100%">
        </div>

        <div>
         <label style="color:white; font-size: 1.2rem;">Is read?: </label>
         <input type="checkbox" id="isReadButtonId" onclick="updateStatusRead(${newBook.id}, this)">
        </div>

        <button onclick="deleteBook(${newBook.id})">Delete</button>

        <div class="info">
        <div>  <strong>Card Id:</strong> ${newBook.id}, </div>
        <div> <strong>Author:</strong> ${newBook.author}, </div>
        <div> <strong>Title:</strong> ${newBook.title}, </div>
        <div> <strong>Pages:</strong> ${newBook.pages}, </div>
        <div> <strong>Image:</strong> ${newBook.image}, </div>
        <div id="readStatus_${newBook.id}"> <strong>IsRead:</strong> ${newBook.isRead} </div>
        </div>
     </div>
  `).appendTo(content);
}

$('.content').on('mouseenter', '.card', function() {
  const info = $(this).find('.info');
  info.fadeIn(200);
  console.log('mouseenter');
});

$('.content').on('mouseleave', '.card', function() {
  const info = $(this).find('.info');
  info.fadeOut(200, function(){
    info.hide();
  });
});
