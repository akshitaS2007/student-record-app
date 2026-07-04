let allStudents = [];

const csvInput = document.getElementById('fileInput');
const errorMessage = document.getElementById('errorMessage');
const totalCount = document.getElementById('totalNumberOfStudents');
const tableBody = document.getElementById('studentInfoTableBody');
const searchName = document.getElementById('searchName');
const searchFatherName = document.getElementById('searchFatherName');
const searchAge = document.getElementById('searchAge');
const searchMath = document.getElementById('searchMathDropDown');
const searchEng = document.getElementById('searchEngDropDown');
const searchComp = document.getElementById('searchCompDropDown');
const searchSci = document.getElementById('searchScienceDropDown');

csvInput.addEventListener('change', async function(event)
{
    const file = event.target.files[0];

    if(!file)
    {
        errorMessage.textContent = 'No CSV file selected';
        return;
    }

    const entireTable = await file.text();

    const lines = entireTable.trim().split('\n');

    const headerLine = lines[0];

    const headers = headerLine.split(',');

    const studentDataLine = lines.slice(1);

    const allStu =[];

    const formatErrors = []; 

    for(let i =0; i<studentDataLine.length; i++)
    {
        const line = studentDataLine[i];

        const values = line.split(',');

        if (values.length !== headers.length) 
        {
        formatErrors.push(`Row ${i + 1} has ${values.length} fields, expected ${headers.length}.`);
        }

        const student = 
        {
            name: values[0].trim(),
            fatherName: values[1].trim(),
            age: Number(values[2].trim()),
            math:values[3].trim(),
            english:values[4].trim(),
            computers:values[5].trim(),
            science:values[6].trim()
        };

        allStu.push(student);
    }

    const validGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

    const validationErrors = [];

    for(let i=0; i<allStu.length; i++)
    {
        const stu = allStu[i];

        if(isNaN(stu.age))
        {
            validationErrors.push(`${stu.name}: invalid age -> ${stu.age}`);
        }

        const grades = [stu.math, stu.english, stu.computers, stu.science];

        for(let j = 0; j<grades.length; j++)
        {
            if(!validGrades.includes(grades[j]))
            {
                validationErrors.push(`${stu.name}: invalid grade -> ${grades[j]}`);
            }
        }
    }

    const allErrors = formatErrors.concat(validationErrors);

    if(allErrors.length>0)
        errorMessage.textContent = 'Errors Found';

    allStudents = allStu;
    totalCount.textContent = 'Total number of Students = '+allStudents.length;

    printTable(allStudents);
});

function printTable(students)
{
    tableBody.innerHTML = '';

    for(let i=0; i< students.length; i++)
    {
        const s = students[i];
        const row = document.createElement('tr');
        row.innerHTML = 
        `<td>${s.name}</td>`+
        `<td>${s.fatherName}</td>`+
        `<td>${s.age}</td>`+
        `<td class = "${gradeColorDecider(s.math)}">${s.math}</td>`+
        `<td class = "${gradeColorDecider(s.english)}">${s.english}</td>`+
        `<td class = "${gradeColorDecider(s.computers)}">${s.computers}</td>`+
        `<td class = "${gradeColorDecider(s.science)}">${s.science}</td>`

        tableBody.appendChild(row);
    }
}

function gradeColorDecider(grade)
{
    if(grade === 'A+')
        return 'a-plus'
    if(grade === 'F')
        return 'f'
}

function applyFilters()
{
    const filtered = allStudents.filter(function(s){
        const nameMatch = s.name.toLowerCase().includes(searchName.value.toLowerCase());
        const fatherNameMatch = s.fatherName.toLowerCase().includes(searchFatherName.value.toLowerCase());
        const ageMatch = searchAge.value === '' || String(s.age) === searchAge.value;
        const mathMatch = searchMath.value === '' || String(s.math) === searchMath.value;
        const englishMatch = searchEng.value === '' || String(s.english) === searchEng.value;
        const compMatch=searchComp.value === '' || String(s.computers) === searchComp.value;
        const scienceMatch=searchSci.value === '' || String(s.science) === searchSci.value;

        return nameMatch && fatherNameMatch && ageMatch && mathMatch && englishMatch && compMatch && scienceMatch;
    });

    printTable(filtered);
    totalCount.textContent = 'Total number of Students = ' + filtered.length;
}

searchName.addEventListener('input', applyFilters);
searchFatherName.addEventListener('input', applyFilters);
searchAge.addEventListener('input', applyFilters);
searchMath.addEventListener('input', applyFilters);
searchEng.addEventListener('input', applyFilters);
searchComp.addEventListener('input', applyFilters);
searchSci.addEventListener('input', applyFilters);

const gradeRanks = {
    'A+':1, 'A':2, 'A-':3,
    'B+':4, 'B':5, 'B-':6,
    'C+':7, 'C':8, 'C-':9,
    'D+':10, 'D':11, 'F':12
};

document.getElementById('name').addEventListener('click', function()
{
    const sorted = allStudents.slice().sort(function(a,b)
    {
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    else return 0;
    });
printTable(sorted);
});

document.getElementById('fatherName').addEventListener('click', function()
{
    const sorted = allStudents.slice().sort(function(a,b)
    {
    if(a.fatherName < b.fatherName) return -1;
    if(a.fatherName > b.fatherName) return 1;
    else return 0;
    });
printTable(sorted);
});

document.getElementById('age').addEventListener('click', function()
{
    const sorted = allStudents.slice().sort(function(a,b)
    {
    if(a.age < b.age) return -1;
    if(a.age > b.age) return 1;
    else return 0;
    });
printTable(sorted);
});

document.getElementById('math').addEventListener('click', function()
{
    const sorted = allStudents.slice().sort(function(a,b)
    {
    if(gradeRanks[a.math] < gradeRanks[b.math]) return -1;
    if(gradeRanks[a.math] > gradeRanks[b.math]) return 1;
    else return 0;
    });
printTable(sorted);
});

document.getElementById('english').addEventListener('click', function()
{
    const sorted = allStudents.slice().sort(function(a,b)
    {
    if(gradeRanks[a.english] < gradeRanks[b.english]) return -1;
    if(gradeRanks[a.english] > gradeRanks[b.english]) return 1;
    else return 0;
    });
printTable(sorted);
});

document.getElementById('compsci').addEventListener('click', function()
{
    const sorted = allStudents.slice().sort(function(a,b)
    {
    if(gradeRanks[a.computers] < gradeRanks[b.computers]) return -1;
    if(gradeRanks[a.computers] > gradeRanks[b.computers]) return 1;
    else return 0;
    });
printTable(sorted);
});

document.getElementById('science').addEventListener('click', function()
{
    const sorted = allStudents.slice().sort(function(a,b)
    {
    if(gradeRanks[a.science] < gradeRanks[b.science]) return -1;
    if(gradeRanks[a.science] > gradeRanks[b.science]) return 1;
    else return 0;
    });
printTable(sorted);
});