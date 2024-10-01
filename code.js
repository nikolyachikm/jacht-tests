var getTitle = (localizedQuestion, index) => {
	return `${index + 1}) ${localizedQuestion.title}`;
};

var getOptionText = (option, optionIndex) => {
	var letters = ['a', 'b', 'c', 'd', 'e', 'f'];

	return `${letters[optionIndex]}) ${option.text}`;
};

var getQuestionTitle = (question, index) => {
	var questionEl = document.createElement('div');
	questionEl.classList.add("question-title");

	questionEl.innerText = getTitle(question, index);

	return questionEl;
};

var updateResults = () => {
	var results = document.getElementById('results');
	var rightAnswersCount = getTestResults();
	results.innerText = `${rightAnswersCount} / ${window.questions.length}`;
};

var getQuestionOption = (option, index, questionIndex, locale) => {
	var optionEl = document.createElement('div');
	optionEl.classList.add("question-option");

	var inputEl = document.createElement('input');
	inputEl.type = 'checkbox';
	inputEl.id = `question-option-${questionIndex}_${index}_${locale}`;
	inputEl.setAttribute('data-question-id', questionIndex);

	if (option.isRight) {
		inputEl.setAttribute('data-question-is-right', 'true');
	}

	inputEl.addEventListener('change', () => {
		if (!inputEl.checked) {
			optionEl.classList.remove("question-right");
			optionEl.classList.remove("question-wrong");
		} else {
			optionEl.classList.add(option.isRight ? "question-right" : "question-wrong");
		}

		Array.from(document.querySelectorAll(`[data-question-id="${questionIndex}"]`))
			.forEach((checkbox) => {
				if (checkbox.id !== inputEl.id) {
					checkbox.disabled = inputEl.checked;
				}
			});

		updateResults();
	});

	var optionTitleEl = document.createElement('label');
	optionTitleEl.innerText = getOptionText(option, index);
	optionTitleEl.setAttribute('for', inputEl.id);

	optionEl.appendChild(inputEl);
	optionEl.appendChild(optionTitleEl);

	return optionEl;
};

var getQuestion = (question, index, locale) => {
	var questionEl = document.createElement('div');
	questionEl.classList.add("question");

	questionEl.appendChild(getQuestionTitle(question, index));

	question.options.forEach((option, optionIndex) => {
		questionEl.appendChild(getQuestionOption(option, optionIndex, index, locale));
	});

	return questionEl;
};

var getQuestionImages = (question, index) => {
	if (!question.images) {
		return null;
	}

	var imgConainer = document.createElement('div');
	imgConainer.classList.add("question-images");

	question.images.forEach((image) => {
		var imgEl = document.createElement('img');
		imgEl.setAttribute('src', `./images/${image}`);

		imgConainer.appendChild(imgEl);
	});

	return imgConainer;
};

var main = document.getElementById('main');

var questionsContent = window.questions.map((question, index) => {
	var element = document.createElement('div');
	element.classList.add("question-container");

	element.appendChild(getQuestion(question.pol, index, 'pol'));
	element.appendChild(getQuestion(question.rus, index, 'rus'));

	var imagesContainer = getQuestionImages(question, index);
	if (imagesContainer) {
		element.appendChild(imagesContainer);
	}

	return element;
});

var getTestResults = () => {
	return Array.from(document.querySelectorAll('[data-question-is-right="true"]')).filter(i=>i.checked).length;
};

questionsContent.forEach((el) => main.appendChild(el));

updateResults();
