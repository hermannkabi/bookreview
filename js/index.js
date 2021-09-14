import {initializeApp} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {getFirestore, getDocs, collection} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyAw5T0ngxLxA0aR79xehgjdZ0X0HcgDWPc",
  authDomain: "bookreviewbyhermann.firebaseapp.com",
  projectId: "bookreviewbyhermann",
  storageBucket: "bookreviewbyhermann.appspot.com",
  messagingSenderId: "264652740894",
  appId: "1:264652740894:web:8f14c6bcf2e0f1196f510f",
  measurementId: "G-80TSN5T65S"
});

var db = getFirestore(firebaseApp);

async function getBooks(){

  console.log("here");

  var booksCollection = collection(db, "books");
  var books = await getDocs(booksCollection);
  books.forEach((doc) => {
    const bookId = doc.data()["bookId"];
    const imageSrc = doc.data()["thumbnail"] ?? "images/white.jpg";
    const title = doc.data()["name"];
    console.log("adding book " + title);



    // TODO: Change the look of a thumbnail that is not found (now it is just a white image)
    // If you find a way to make this look better, please do (it's 20:00, I'm tired)
    const widget = '<div class="book col-lg-3 col-md-6 col-sm-1" style="text-align:center;">  <a href="book/?id=' + bookId +'"><img class="thumbnail" src="' + imageSrc + '" height="194px" width="128px"></a><p class="subtitle">'+ title +'</p></div>';
    $(".booklist").prepend(widget);
  });
}
// $("h1").click(function (){
//   const widget = '<div class="book col-lg-3 col-md-6" style="text-align:center;">  <a style="text-decoration:none;" href="book/?id=bookId1"><img style="font-size:32px;" class="thumbnail" src="https://google.com" alt="Thumbnail for Book Title" onerror="this.style.display =\'none\'" height="194px" width="128px"></a><p class="subtitle">Book Name</p></div>';
//   $(".booklist").prepend(widget);
// });
// $("h2").click(function (){
//   $(".book").remove();
// });

getBooks();

$("#searchbox").on("input", function (){
  var query = $("#searchbox").val();
  $(".book").each(function(index){
    $(this).show();
    var title = $(this).text();
    console.log(title);
    if(!title.toLowerCase().includes(query.toLowerCase())){
      $(this).hide();
    }
  });
});


$("body").on('DOMSubtreeModified', ".booklist", function() {
  var isEmpty = $(".booklist").show().children().show().length === 0;
  if(isEmpty){
    $(".booklist").prepend("<p class='noBooks'>No books were found</p>");
  }else{
    $(".noBooks").remove();
  }
});
