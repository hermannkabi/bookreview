import {initializeApp} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import {getFirestore, doc, getDoc, updateDoc} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";

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


function getParameter(parameterName){

  var parameters = new URLSearchParams(window.location.search);
  return parameters.get(parameterName);
}


function setData(imageSrc, bookTitle, description, pages, categories, isbn, review){
  var converter = new showdown.Converter();
  var mdToHtml = converter.makeHtml(review);
  $(".image-div .review-img").attr("src", imageSrc);
  $("title").text(bookTitle);
  $(".center-img").hide();
  $(className == ".review-element" ? ".review-element-mobile" : ".review-element").addClass("hidden");
  $(className).removeClass("hidden");
  $(className +" .book-title").text(bookTitle);
  $(className +" .book-description").text($(window).width() <= 1350 && className === ".review-element" ? description.substring(0, 300) + "..." : description);
  $(className +" .book-detail-pages").text(pages);
  $(className +" .book-detail-genre").text(categories);
  $(className +" .book-detail-isbn").text(isbn);
  console.log($(className +" .my-review").html().trim() === "");
  $(className +" .my-review").html().trim() === "" ? $(className +" .my-review").html(mdToHtml) : console.log("Don't change anything!");;
}

var className = $(window).width()<=1000 ? ".review-element-mobile" : ".review-element";

// Finds info for the book
const bookId = getParameter("id");
const docRef = doc(db, "books", bookId);
const docSnap = await getDoc(docRef);
var bookTitle;
var imageSrc;
var description;
var pages;
var categories;
var isbn;

var review;

if(docSnap.exists()){
  // This syntax for getting data from document of book
  bookTitle = docSnap.data()["name"];
  imageSrc = docSnap.data()["thumbnail"] ?? "/images/white.jpg";
  description = docSnap.data()["description"] ?? "No Description Provided";

  // Book details come Here
  pages = docSnap.data()["pages"] ?? 0;
  categories = docSnap.data()["categories"][0] ?? "-";
  isbn = docSnap.data()["isbn"] ?? "-";

  // Just the Markdown
  review = docSnap.data()["review"] ?? "# No review (yet!)";



  setData(imageSrc, bookTitle, description, pages, categories, isbn, review);

}else{
  $(".text").text("Couldn't find that book.");
}

$(window).resize(function (){



  if($(window).width() <= 1000){
    className = ".review-element-mobile";
    setData(imageSrc, bookTitle, description, pages, categories, isbn, review);
  }else{
    className = ".review-element";
    setData(imageSrc, bookTitle, description, pages, categories, isbn, review);
  }
});


$(className+" .edit-review-btn").click(function (){
  var onSave = $(this).text() === "Save";
  $(this).text(onSave ? "Edit Review" : "Save");


  var newReview;
  var converter;
  if(onSave){
    //Save content

    newReview = $(className+" .edit-review-input").val();
    converter = new showdown.Converter();
    if(!(newReview === review)){
      //The new review is actually different, so worth saving
      review = newReview;
      (async () => {
        await updateDoc(doc(db, "books", bookId), {"review":newReview});
      })();
    }

  }

  $(className+" .my-review").html(onSave ? converter.makeHtml(newReview) : '<textarea class="edit-review-input" cols="60" rows="10" name="text"></textarea>');
  $(className+" .edit-review-input").val(review);
});
