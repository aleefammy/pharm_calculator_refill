const dayEachMonth = document.getElementById("days-each-month");
const monthEachYear = document.getElementById("month-each-year");
const checkedMonth = document.getElementsByClassName("checked");
const selectElements = document.querySelectorAll("select[multiple]");
const selectElement = document.getElementById("selected-months");
const calculateTable = document.getElementById("calculate-table");
const calculateMainTable = document.querySelector(".calculate-table-main-flex");
const totalDays = document.getElementById("totalDays");
const totalTabColumn = document.querySelectorAll("#totalTabColumn .content");

const x = document.querySelectorAll("input.content");
const y = document.getElementById("defaultDays");

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
let selectedMonthInitial = [];
let selectedMonth = [];
let monthInOrder = [];
let calculateYear = 0;
let totalDaysValue = 0;
let indicateGenTable = false;

const monthArray = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤษจิกายน','ธันวาคม'];

let monthDays = {
    มกราคม:[31,'ม.ค.'],
    กุมภาพันธ์:[leapYear(currentYear,currentMonth),'ก.พ.'],
    มีนาคม:[31,'มี.ค.'],
    เมษายน:[30,'เม.ย'],
    พฤษภาคม:[31,'พ.ค.'],
    มิถุนายน:[30,'มิ.ย.'],
    กรกฎาคม:[31,'ก.ค.'],
    สิงหาคม:[31,'ส.ค.'],
    กันยายน:[30,'ก.ย.'],
    ตุลาคม:[31,'ต.ค.'],
    พฤษจิกายน:[30,'พ.ย.'],
    ธันวาคม:[31,'ธ.ค.']
    };

selectElements.forEach(el => {
    el.addEventListener('change',()=>{

        indicateGenTable = true;

        //clear selectedMonth array and calculateTable all childNode
        selectedMonthInitial = [];
        selectedMonth = [];
        calculateTable.innerHTML = '';
        totalDaysValue = 0;

        // display none if there're no month selected
        if (checkedMonth.length === 0) {
            calculateMainTable.style.display='none';
        }

        // loop to push selected month in selectedMonth array
        for (let index = 0; index < checkedMonth.length; index++) {
            const element = checkedMonth[index];
            let textMonth = element.innerText;
            let i = textMonth.indexOf(":");
            let len = textMonth.length;
            selectedMonthInitial.push(textMonth.substring(i+2,len));
            //console.log(selectedMonthInitial);
        }

        // remove unselected month in monthInOrder array
        for (let index = 0; index < 12; index++) {
            if (selectedMonthInitial.indexOf(monthInOrder[index])>-1) {
                //keep old value
            }else{
                //assign new value, which will filter out later
                monthInOrder[index] = "-";
            }
        }

        // filter only selected month (not include "-")
        monthInOrder.filter((month)=>{
            if (month !== "-") {
                selectedMonth.push(month)
            }
        });
        // reset monthInOrder array
        genMonthInOrder(currentMonth);

        // loop to create calculate table element
        selectedMonth.forEach((month, index) => {
            const divCalculateTblItem = document.createElement('div');
            const divCalculateHeader = document.createElement('div');
            const divCalculateContent = document.createElement('div');
    
            divCalculateTblItem.classList.add('calculate-table-item');
            divCalculateHeader.classList.add('header');
            // if it's last element put round-right class to set right round corner of calculate table and display all the complete calculate table
            if (index+1 === selectedMonth.length) {
                divCalculateHeader.classList.add('round-right');
                calculateMainTable.style.display='flex';
            }
            divCalculateContent.classList.add('content');
    
            divCalculateHeader.innerText = monthDays[month][1];
            divCalculateContent.innerText = "-";
    
            divCalculateTblItem.appendChild(divCalculateHeader);
            divCalculateTblItem.appendChild(divCalculateContent);
            for (let index = 0; index < 6; index++) {
                divCalculateTblItem.appendChild(divCalculateContent.cloneNode(true));
            }
    
            calculateTable.appendChild(divCalculateTblItem);

            //loop to sum all month values
            totalDaysValue = totalDaysValue + monthDays[month][0];
        });

        totalDays.innerText = totalDaysValue;

        const calculateTableContent = document.querySelectorAll("#calculate-table>div .content")
        for (let index = 0; index < 7; index++) {
            calculate(selectedMonth.length,y.value,totalDaysValue,x[index].value,index,calculateTableContent);
        }

    });
});

x.forEach(input => {
    input.addEventListener('input',(e)=>{
        //console.log(e.target.value);
        //console.log('classlist: '+e.target.classList[1]);
        const calculateTableContent = document.querySelectorAll("#calculate-table>div .content")
            // console.log(calculateTableContent.length);
        calculate(selectedMonth.length,y.value,totalDaysValue,e.target.value,e.target.classList[1],calculateTableContent);
    })
});

y.addEventListener('change',()=>{
    if(indicateGenTable){
        const calculateTableContent = document.querySelectorAll("#calculate-table>div .content")
        for (let index = 0; index < 7; index++) {
            calculate(selectedMonth.length,y.value,totalDaysValue,x[index].value,index,calculateTableContent);
        }
    }
})

function calculate(totalMonths,initialDays,totalDaysValue,value,targetClassNum,genMonth) {
    const answer = [value*totalDaysValue];
    targetClassNum = Number(targetClassNum);

    totalTabColumn[targetClassNum].innerText = answer[0];

    for (let index = 1; index <= totalMonths; index++) {
        switch (index) {
            case 1:
                answer.push(value*initialDays);
                break;
            case totalMonths:
                answer.push((value*totalDaysValue)-(value*initialDays)-(value*30*(totalMonths-2)));
                break;
            default:
                answer.push(value*30);
                break;
        } 
        // console.log(answer);
        // console.log(totalMonths);
        // console.log(initialDays);
        genMonth[targetClassNum+(7*(index-1))].innerText = answer[index];
    }

}


function leapYear(currentYear,currentMonth) {
    // check if after feb this year
    if (currentMonth>1) {
        calculateYear = currentYear + 1;
    } else {
        calculateYear = currentYear;
    }

    if (calculateYear%4 === 0) {
        return 29;
    } else {
        return 28;
    }
}

function genMonthHeader(currentYear, currentMonth) {

    // for (let index = 0; index < 12; index++) {
    //     if (index === 12-currentMonth) {
    //         adjustMonthIndex = currentMonth*-1;
    //     } else if (index > 12-currentMonth) {
    //         adjustMonthIndex++
    //     }
    //      else {
    //         adjustMonthIndex = index;
    //     }
    //     const divDaysEachMonth = document.createElement('div');
    //     const divMonth = document.createElement('div');

    //     divDaysEachMonth.classList.add('days-in-month');
    //     divMonth.classList.add('month');

    //     divDaysEachMonth.innerText = monthDays[monthArray[currentMonth+adjustMonthIndex]];
    //     divDaysEachMonth.style.display = 'none';
    //     divMonth.innerText = monthArray[currentMonth+adjustMonthIndex];

    //     dayEachMonth.appendChild(divDaysEachMonth);
    //     monthEachYear.appendChild(divMonth)
    // }

    for (let index = 0; index < 12; index++) {
        const divDaysEachMonth = document.createElement('div');
        const divMonth = document.createElement('div');
        const optionMonth = document.createElement('option');

        divDaysEachMonth.classList.add('days-in-month');
        divMonth.classList.add('month');

        divDaysEachMonth.innerText = monthDays[monthArray[index]][0];
        divDaysEachMonth.style.display = 'block';
        divMonth.innerText = monthArray[index];
        optionMonth.innerText = (index+1).toString() + ": " + monthArray[index];

        dayEachMonth.appendChild(divDaysEachMonth);
        monthEachYear.appendChild(divMonth);
        selectElement.appendChild(optionMonth);
    }


}

function genMonthInOrder(currentMonth) {
    monthInOrder = [];
    let adjustMonthIndex = 0;
    for (let index = 0; index < 12; index++) {
        if (index === 12-currentMonth) {
            adjustMonthIndex = currentMonth*-1;
        } else if (index > 12-currentMonth) {
            adjustMonthIndex++
        }
         else {
            adjustMonthIndex = index;
        }
        monthInOrder.push(monthArray[currentMonth+adjustMonthIndex])
    }
}


monthEachYear.addEventListener('click',()=>{
    
})


// on load
genMonthHeader(currentYear, currentMonth);
genMonthInOrder(currentMonth);