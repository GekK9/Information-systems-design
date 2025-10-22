document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const resultsSection = document.getElementById('resultsSection');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const directionsTable = document.getElementById('directionsTable');

    // Маппинг названий предметов с data-атрибутами
    const subjectMapping = {
        'russian': 'Русский язык',
        'math': 'Математика',
        'physics': 'Физика',
        'chemistry': 'Химия',
        'foreign': 'Английский язык',
        'biology': 'Биология',
        'geography': 'География',
        'informatics': 'Информатика',
        'foreign': 'Испанский язык',
        'history': 'История',
        'foreign': 'Китайский язык',
        'literature': 'Литература',
        'foreign': 'Немецкий язык',
        'social': 'Обществознание',
        'foreign': 'Французский язык'
    };

    searchButton.addEventListener('click', filterDirections);

    function filterDirections() {
        // Собираем введенные баллы
        const scores = {};
        const inputs = document.querySelectorAll('.card__input');

        inputs.forEach(input => {
            const subject = input.getAttribute('data-subject');
            const score = parseInt(input.value);

            if (!isNaN(score) && score >= 30 && score <= 100) {
                scores[subject] = score;
            }
        });

        // Показываем секцию с результатами
        resultsSection.classList.remove('hidden');

        // Получаем все строки таблицы (кроме заголовка и примечания)
        const rows = directionsTable.querySelectorAll('tbody tr');
        let hasVisibleRows = false;

        rows.forEach(row => {
            // Пропускаем строку с примечанием
            if (row.cells.length === 1) {
                return;
            }

            // Проверяем, подходит ли направление по предметам
            if (isDirectionSuitable(row, scores)) {
                row.classList.remove('hidden');
                row.classList.add('highlight');
                hasVisibleRows = true;
            } else {
                row.classList.add('hidden');
                row.classList.remove('highlight');
            }
        });

        // Показываем/скрываем сообщение об отсутствии результатов
        if (hasVisibleRows) {
            noResultsMessage.classList.add('hidden');
            directionsTable.classList.remove('hidden')

        } else {
            noResultsMessage.classList.remove('hidden');
            directionsTable.classList.add('hidden')
        }
    }

    function isDirectionSuitable(row, scores) {
        const requiredSubjects = row.getAttribute('data-required');
        const optionalSubjects = row.getAttribute('data-optional');

        if (!requiredSubjects) {
            return false; // Если нет data-атрибутов, не показываем строку
        }

        // Проверяем обязательные предметы
        const requiredList = requiredSubjects.split(',');
        for (const subject of requiredList) {
            if (!scores[subject]) {
                return false; // Не хватает обязательного предмета
            }
        }

        // Проверяем, есть ли хотя бы один предмет из optional
        if (optionalSubjects) {
            const optionalList = optionalSubjects.split(',');
            let hasOptional = false;

            for (const subject of optionalList) {
                if (scores[subject]) {
                    hasOptional = true;
                    break;
                }
            }

            if (!hasOptional) {
                return false; // Нет ни одного предмета по выбору
            }
        }

        return true;
    }
});