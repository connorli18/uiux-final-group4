var quiz_score = localStorage.getItem('quiz_score') || 0; // Retrieve quiz score from localStorage or set to 0 if not available

// Function to set up the quiz question
function quizquestionPage(id){

    // console.log("Hello from questionquiz");  // error checking
    // console.log(id);  //error checking

    //Ajax function for homepage
    $.ajax({
        type: "POST",
        url: "quizquestion",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(id),
        success: function(result){
            //console.log("success"); 
            //console.log(result); //Check if successful
            displayQuizquestionPage(result)
        },
        error: function(request, status, error){
            console.log("Error");
            console.log(request);
            console.log(status);
            console.log(error);
        }
    });

}

//function to display quiz question
function displayQuizquestionPage(question_data){

    // console.log("Hello Display QuizquestionPage"); 
    console.log(question_data);

    let question_array = question_data.question;
    let questionObj = question_array[0];

    // Extract the properties from the question object
    let question = questionObj.question;
    let answer1 = questionObj.answer1;
    let answer2 = questionObj.answer2;
    let answer3 = questionObj.answer3;
    let answer4 = questionObj.answer4;
    let correctanswer = questionObj.correctanswer;
    let id = questionObj.id;

    console.log(question);
    
    // Add the question to the div
    let row_1 = $("<div class='row'>");
    let div_question_col_12_1 = $("<div class='col-md-12 col-sm-12'>");     //Create div in row for info
    $(div_question_col_12_1).append(question);
    $(row_1).append(div_question_col_12_1);
    $("#quizpage_question_1").append(row_1);   
    
    // Add answers
    let row_2 = $("<div class='row'>");
    let div_question_col_12_2 = $("<div class='col-md-12 col-sm-12'>");     //Create div in row for info
    let answer_button_1 = $("<a class='btn btn-outline-dark btn-lg btn-block' role='button'></a>");
    let answer_button_2 = $("<a class='btn btn-outline-dark btn-lg btn-block' role='button'></a>");
    let answer_button_3 = $("<a class='btn btn-outline-dark btn-lg btn-block' role='button'></a>");
    let answer_button_4 = $("<a class='btn btn-outline-dark btn-lg btn-block' role='button'></a>");
    $(answer_button_1).append(answer1); 
    $(answer_button_2).append(answer2); 
    $(answer_button_3).append(answer3); 
    $(answer_button_4).append(answer4); 
    $(div_question_col_12_2).append(answer_button_1);
    $(div_question_col_12_2).append(answer_button_2);
    $(div_question_col_12_2).append(answer_button_3);
    $(div_question_col_12_2).append(answer_button_4);
    $(row_2).append(div_question_col_12_2);
    $("#quizpage_answer_1").append(row_2);   
    
    // Add click event listeners to answer buttons
    $("a.btn").on("click", function() {
        let selectedAnswer = $(this).text(); // Get the text of the clicked button
        answer_button_1.addClass("disabled");
        answer_button_2.addClass("disabled");
        answer_button_3.addClass("disabled");
        answer_button_4.addClass("disabled");
        // Check if selected answer matches the correct answer
        if (selectedAnswer === correctanswer) {
            // Output correct response
            console.log("Correct answer response");
            quiz_score++;
            localStorage.setItem('quiz_score', quiz_score); // Update quiz score in localStorage
            console.log(quiz_score);
            
        } else {
            // Output wrong response
            console.log("Wrong answer response");
        }
    });

    // Set up next and prev button
    console.log(id);
    next_id = id + 1;
    prev_id = id - 1;
    prev_href = '/quizquestion/' + prev_id;
    next_href = '/quizquestion/' + next_id;
    console.log(next_href);

    let row_3 = $("<div class='row'>");
    let div_question_col_12_3 = $("<div class='col-md-12 col-sm-12'>");     //Create div in row for info
    let prev_button_1 = $("<a class='btn btn-outline-dark btn-lg' role='button'><-</a>");
    let next_button_1 = $("<a class='btn btn-outline-dark btn-lg' role='button'>-></a>");
        
    if (prev_id == 0 && next_id == 2){
        $(prev_button_1).attr('href', '/quiz');
        $(next_button_1).attr('href', next_href);
    }else if (prev_id == 3 && next_id == 5){
        $(prev_button_1).attr('href', prev_href);
        $(next_button_1).attr('href', '/quizcomplete');
    }else {
        $(prev_button_1).attr('href', prev_href);
        $(next_button_1).attr('href', next_href);
    }
    $(div_question_col_12_3).append(prev_button_1);
    $(div_question_col_12_3).append(next_button_1);
    $(row_3).append(div_question_col_12_3);
    $("#quizpage_nextbutton_1").append(row_3); 

}

function quizcompletePage(){
    console.log(quiz_score); 

    localStorage.setItem('quiz_score', quiz_score);
    final_score = quiz_score + "/4"; 
    $("#quizcomplete_score").append(final_score);
    quiz_score = 0;

}

$(document).ready(function(){

    //strings depends on the search
    let quiz_str = "quizquestion"; 
    let quiz_complete_str = "quizcomplete"; 

    // Get the query parameter from the URL from the search
    const search_query_string = window.location.href;
    console.log("this is the url: " + search_query_string);

    if (search_query_string.includes(quiz_str)){    

        console.log("this is the quizstr: " + quiz_str);
        const regex = /\/(\d+)$/;
        const match = search_query_string.match(regex); 
        const id = parseInt(match[1]); //Extract the id number of resto
        console.log("Hello" + id);    //error checking
        quizquestionPage(id);
        // console.log("Hello from else if");    //error checking
    }else if (search_query_string.includes(quiz_complete_str)){
        quizcompletePage();
    }

});
