// Function to set up the quiz question
function quizquestionPage(id){

    // console.log("Hello from questionquiz");  // error checking
    // console.log(id);  //error checking
    track_id = id;

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
            displayQuizquestionPage(result, track_id)
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
function displayQuizquestionPage(question_data, track_id){

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
    let description = questionObj.description;
    
    // console.log(description);        // Error Checking
    // console.log(question);           // Error Checking
    
    // Add the question to the div
    let row_1 = $("<div class='row'>");
    let div_question_col_12_1 = $("<div class='col-md-12 col-sm-12'>");     //Create div in row for info
    $(div_question_col_12_1).append(question);
    $(row_1).append(div_question_col_12_1);
    $("#quizpage_question_1").append(row_1);   
    
    // Add answers
    let row_2 = $("<div class='row'>");
    let div_question_col_12_2 = $("<div class='col-md-12 col-sm-12'>");     
    let answer_div_1 = $("<div id='answer-div' class='container'>");
    let answer_div_2 = $("<div id='answer-div' class='container'>");
    let answer_div_3 = $("<div id='answer-div' class='container'>");
    let answer_div_4 = $("<div id='answer-div' class='container'>");
    let answer_button_1 = $("<a class='btn btn-outline-secondary btn-lg answer-btn' role='button'></a>");
    let answer_button_2 = $("<a class='btn btn-outline-secondary btn-lg answer-btn' role='button'></a>");
    let answer_button_3 = $("<a class='btn btn-outline-secondary btn-lg answer-btn' role='button'></a>");
    let answer_button_4 = $("<a class='btn btn-outline-secondary btn-lg answer-btn' role='button'></a>");
    $(answer_button_1).append(answer1); 
    $(answer_button_2).append(answer2); 
    $(answer_button_3).append(answer3);
    $(answer_button_4).append(answer4); 
    $(answer_div_1).append(answer_button_1);
    $(answer_div_2).append(answer_button_2);
    $(answer_div_3).append(answer_button_3);
    $(answer_div_4).append(answer_button_4);
    $(div_question_col_12_2).append(answer_div_1);
    $(div_question_col_12_2).append(answer_div_2);
    $(div_question_col_12_2).append(answer_div_3);
    $(div_question_col_12_2).append(answer_div_4);
    $(row_2).append(div_question_col_12_2);
    $("#quizpage_answer_1").append(row_2);   
    
    // Add click event listeners to answer buttons
    // Add click event listeners to answer buttons
    $("a.btn").on("click", function() {
        let selectedAnswer = $(this).text(); // Get the text of the clicked button

        // Remove the disabled class from all buttons to allow re-selection
        answer_button_1.removeClass("disabled");
        answer_button_2.removeClass("disabled");
        answer_button_3.removeClass("disabled");
        answer_button_4.removeClass("disabled");

        // Remove the selected-correct and selected-incorrect classes from all buttons to reset their state
        answer_button_1.removeClass("selected-correct selected-incorrect");
        answer_button_2.removeClass("selected-correct selected-incorrect");
        answer_button_3.removeClass("selected-correct selected-incorrect");
        answer_button_4.removeClass("selected-correct selected-incorrect");

        // Check if selected answer matches the correct answer
        if (selectedAnswer === correctanswer) {
            // Output correct response
            console.log("Correct answer response");
            $(this).addClass("selected-correct");
            let row_3 = $("<div class='row'>");
            let correct_div_1 = $("<div id='correct-div' style='border: 4px solid green; color: green; padding: 10px; font-size: 20px;' class='container'>");
            result = "Correct! " + description;
            $(correct_div_1).append(result);
            $(row_3).append(correct_div_1);
            $("#quizpage_feedback_1").html(row_3);   // Replace the existing feedback with the new feedback
        } else {
            // Output wrong response
            console.log("Wrong answer response");
            $(this).addClass("selected-incorrect");
            let row_3 = $("<div class='row'>");
            let wrong_div_1 = $("<div id='wrong-div' style='border: 4px solid red; color: red; padding: 10px; font-size: 20px;' class='container'>");
            result = "Incorrect! " + description;
            $(wrong_div_1).append(result);
            $(row_3).append(wrong_div_1);
            $("#quizpage_feedback_1").html(row_3);   // Replace the existing feedback with the new feedback
        }
    });

    // Set up next and prev button
    console.log(track_id);
    next_id = track_id + 1;
    prev_id = track_id - 1;
    prev_href = '/quizquestion/' + prev_id;
    next_href = '/quizquestion/' + next_id;
    console.log(next_href);

    let row_3 = $("<div class='row'>");
    let div_question_col_12_3 = $("<div class='col-md-12 col-sm-12'>");     //Create div in row for info
    let final_div_1 = $("<div id='final-div' class='container'>");
    let prev_button_1 = $("<a class='btn btn-outline-success btn-lg nav_btn' role='button'><-</a>");
    let next_button_1 = $("<a class='btn btn-outline-success btn-lg nav_btn' role='button'>-></a>");
        
    if (prev_id == 0 && next_id == 2){
        $(prev_button_1).attr('href', '/quiz');
        $(next_button_1).attr('href', next_href);
    }else if (prev_id == 4 && next_id == 6){
        $(prev_button_1).attr('href', prev_href);
        $(next_button_1).attr('href', '/quizcomplete');
    }else {
        $(prev_button_1).attr('href', prev_href);
        $(next_button_1).attr('href', next_href);
    }
    $(final_div_1).append(prev_button_1);
    $(final_div_1).append(next_button_1);
    $(div_question_col_12_3).append(final_div_1);
    $(row_3).append(div_question_col_12_3);
    $("#quizpage_nextbutton_1").append(row_3); 

}

$(document).ready(function(){

    //strings depends on the search
    let quiz_str = "quizquestion"; 

    // Get the query parameter from the URL from the search
    const search_query_string = window.location.href;
    console.log("this is the url: " + search_query_string);

    if (search_query_string.includes(quiz_str)){    

        console.log("this is the quizstr: " + quiz_str);
        const regex = /\/(\d+)$/;
        const match = search_query_string.match(regex); 
        const id = parseInt(match[1]); //Extract the id number of question
        console.log("Hello" + id);    //error checking
        quizquestionPage(id);
        // console.log("Hello from else if");    //error checking
    }
});
