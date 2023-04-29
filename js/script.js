const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const option_list = document.querySelector(".option_list");
const timeCount = quiz_box.querySelector(".timer .timer_sec");
const timeLine = quiz_box.querySelector("header .time_line");
const timeOff = quiz_box.querySelector("header .time_text");
var audio = new Audio();

start_btn.onclick = () => {
    audio.pause();
    audio.currentTime = 0;
    audio.src = 'music/2.rules.mp3';
    audio.autoplay = true;
    info_box.classList.add("activeInfo");
}

exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
    audio.pause();
    audio.currentTime = 0;
    audio.src = 'music/1.beginning.mp3';
    audio.autoplay = true;
}

continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    audio.currentTime = 0;
    audio.pause();
    audio.src = 'music/3.think.mp3';
    audio.autoplay = true;
    showQuestions(0);
    queCounter(1);
    startTime(15);
    startTimeLine(0);
}

let que_count = 0;
let que_number = 1;
let counter;
let counterLine;
let timeValue = 15;
let widthValue = 0;
let userScore = 0;


const next_btn = quiz_box.querySelector(".next_btn");
const result_box = document.querySelector(".result_box");
const quit_quiz = result_box.querySelector(".buttons .quit");

quit_quiz.onclick = () => {
    window.location.reload();
    audio.currentTime = 0;
    audio.pause();
    audio.src = 'music/1.beginning.mp3';
    audio.autoplay = true;
}

next_btn.onclick = () => {
    if (que_count < questions.length - 1) {
        que_count++;
        que_number++;
        showQuestions(que_count);
        queCounter(que_number);
        clearInterval(counter);
        startTime(timeValue);
        clearInterval(counterLine);
        startTimeLine(widthValue);
        next_btn.style.display = "none";
        timeOff.textContent = "Time left";
        audio.currentTime = 0;
        audio.pause();
        audio.src = 'music/3.think.mp3';
        audio.autoplay = true;
    } else {
        clearInterval(counter);
        clearInterval(counterLine);
        showResultBox();
        audio.currentTime = 0;
        audio.pause();
        audio.src = 'music/7.end.mp3';
        audio.autoplay = true;
    }
}

function showQuestions(index) {
    const que_text = document.querySelector(".que_text");
    const multiple_answers = document.querySelector(".multiple_answers");
    let que_tag = '<span>' + questions[index].number + ". " + questions[index].question + '</span>';
    let multiple_answersTag;
    if (questions[index].answer.length > 1) {
        que_tag = '<span>' + questions[index].question + '</span>';
        multiple_answersTag = '<span> Multiple answer options </span>';
        multiple_answers.innerHTML = multiple_answersTag;
    }
    else {

        que_tag = '<span>' + questions[index].question + '</span>';
        multiple_answersTag = '<span></span>';
        multiple_answers.innerHTML = multiple_answersTag;
    }
    let option_tag = '<div class="option">' + questions[index].options[0] + '<span></span></div>'
        + '<div class="option">' + questions[index].options[1] + '<span></span></div>'
        + '<div class="option">' + questions[index].options[2] + '<span></span></div>';
    que_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;
    const option = option_list.querySelectorAll(".option");
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)")
    }
}

function optionSelected(answer, time) {
    clearInterval(counter);
    clearInterval(counterLine);
    let userAns = answer.textContent;
    let correctAns = questions[que_count].answer;
    let allOptions = option_list.children.length;

    if (correctAns.includes(userAns)) {
        userScore += 1;
        answer.classList.add("correct");
        answer.classList.add("disabled");
        audio.currentTime = 0;
        audio.pause();
        audio.src = 'music/4.correct.mp3';
        audio.autoplay = true;
    } else {
        answer.classList.add("incorrect")
        answer.classList.add("disabled");
        audio.currentTime = 0;
        audio.pause();
        audio.src = 'music/5.wrong.mp3';
        audio.autoplay = true;

        for (let i = 0; i < allOptions; i++) {
            for (let j = 0; j < allOptions; j++) {
                if (option_list.children[i].textContent == correctAns[j]) {
                    option_list.children[i].setAttribute("class", "option correct");
                    next_btn.style.display = "block";
                }
            }
        }
    }

    let correct_count = document.querySelectorAll('.correct').length;
    let incorrect_count = document.querySelectorAll('.incorrect').length;
    let userAns_count = correct_count + incorrect_count;
    let totalAnsCount = questions[que_count].answer.length;
    if (userAns_count == totalAnsCount) {
        correct_count = 0;
        incorrect_count = 0;
        userAns_count = 0;
        for (let i = 0; i < allOptions; i++) {
            option_list.children[i].classList.add("disabled");
        }
        next_btn.style.display = "block";
    }
    if (totalAnsCount == 1 && incorrect_count == 1) {
        for (let i = 0; i < allOptions; i++) {
            option_list.children[i].classList.add("disabled");
        }
    }
    if (correct_count == 1 && totalAnsCount == 2) {
        startTime(15);
        startTimeLine(15);
        userScore--;
    }
    next_btn.style.display = "block";
}

function showResultBox() {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score_text");
    let scoreTag = '<span>You got <p>' + userScore + '</p> out of <p>' + questions.length + '</p></span>';
    scoreText.innerHTML = scoreTag;
}

function startTime(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }
        if (time < 0) {
            clearInterval(counter);
            timeCount.textContent = "00";
            timeOff.textContent = "Time off";
            let correctAns = questions[que_count].answer;
            let allOptions = option_list.children.length;
            audio.currentTime = 0;
            audio.pause();
            audio.src = 'music/6.time-out.mp3';
            audio.autoplay = true;

            for (let i = 0; i < allOptions; i++) {
                for (let j = 0; j < allOptions; j++) {
                    if (option_list.children[i].textContent == correctAns[j]) {
                        option_list.children[i].setAttribute("class", "option correct");
                        next_btn.style.display = "block";
                    }
                }
            }

            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled");
            }
            next_btn.style.display = "block";
        }
    }
}

function startTimeLine(time) {
    counterLine = setInterval(timer, 29);
    function timer() {
        time += 1;
        timeLine.style.width = time + "px";
        if (time > 550) {
            clearInterval(counterLine);
        }
    }
}

function queCounter(index) {
    const bottom_ques_counter = quiz_box.querySelector(".total_que");
    let totalQuesCountTag = '<span><p>' + index + ' </p><p>Of</p><p>' + questions.length + '</p>Questions</span>';
    bottom_ques_counter.innerHTML = totalQuesCountTag;
}