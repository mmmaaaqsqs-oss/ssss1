//==================================

// 1. كلاس الطالب Student

// ==================================

class Student {

    // Private Fields

    #name;

    #grades;

    #attendance;

    constructor(name, grades, attendance) {

        this.name = name;

        this.grades = grades;

        this.attendance = attendance;

    }

    // حماية اسم الطالب

    set name(value) {

        if (!value || value.trim() === "") {

            throw new Error("من فضلك أدخل اسم الطالب");

        }

        this.#name = value.trim();

    }

    get name() {

        return this.#name;

    }

    // حماية الدرجات

    set grades(value) {

        if (!Array.isArray(value) || value.length !== 3) {

            throw new Error("يجب إدخال درجات المواد الثلاث");

        }

        const validGrades = value.map(grade => {

            if (grade === "" || grade === null ||

                grade === undefined) {

                throw new Error("يجب عدم ترك أي درجة فارغة");

            }

            const number = Number(grade);

            if (!Number.isFinite(number) ||

                number < 0 || number > 100) {

                throw new Error("الدرجات يجب أن تكون من 0 إلى 100");

            }

            return number;

        });

        this.#grades = validGrades;

    }

    get grades() {

        return this.#grades;

    }

    // حماية نسبة الحضور

    set attendance(value) {

        if (value === "" || value === null ||

            value === undefined) {

            throw new Error("من فضلك أدخل نسبة الحضور");

        }

        const number = Number(value);

        if (!Number.isFinite(number) ||

            number < 0 || number > 100) {

            throw new Error("نسبة الحضور يجب أن تكون من 0 إلى 100");

        }

        this.#attendance = number;

    }

    get attendance() {

        return this.#attendance;

    }

    // حساب متوسط درجات الطالب

    get average() {

        return this.#grades.reduce(

            (total, grade) => total + grade, 0

        ) / this.#grades.length;

    }

}

// ==================================

// 2. مصفوفة الطلاب

// ==================================

let studentsList = [];

// ==================================

// 3. الإمساك بعناصر HTML

// ==================================

const studentName =

    document.getElementById("studentName");

const grade1 =

    document.getElementById("grade1");

const grade2 =

    document.getElementById("grade2");

const grade3 =

    document.getElementById("grade3");

const attendance =

    document.getElementById("attendance");

const addStudentBtn =

    document.getElementById("addStudentBtn");

const graceCommitteeBtn =

    document.getElementById("graceCommitteeBtn");

const errorBox =

    document.getElementById("errorBox");

const studentsBox =

    document.getElementById("studentsList");

const reportBox =

    document.getElementById("reportBox");

// ==================================

// 4. إضافة طالب جديد

// ==================================

addStudentBtn.onclick = function () {

    try {

        // إخفاء رسالة الخطأ القديمة

        errorBox.classList.add("d-none");

        errorBox.textContent = "";

        // إنشاء كائن الطالب

        const student = new Student(

            studentName.value,

            [

                grade1.value,

                grade2.value,

                grade3.value

            ],

            attendance.value

        );

        // إضافة الطالب للمصفوفة

        studentsList.push(student);

        // عرض الطالب على الشاشة

        const studentDiv = document.createElement("div");

        studentDiv.textContent =

            `اسم الطالب: ${student.name} |

             المتوسط: ${student.average.toFixed(2)} |

             الحضور: ${student.attendance}%`;

        studentsBox.appendChild(studentDiv);

        // تفريغ الحقول

        studentName.value = "";

        grade1.value = "";

        grade2.value = "";

        grade3.value = "";

        attendance.value = "";

        // تفريغ التقرير القديم

        reportBox.innerHTML = "";

    }

    catch (error) {

        // عرض الخطأ على الشاشة

        errorBox.textContent = error.message;

        errorBox.classList.remove("d-none");

    }

};

// ==================================

// 5. تفعيل لجنة الرأفة

// ==================================

graceCommitteeBtn.onclick = function () {

    // إخفاء الأخطاء السابقة

    errorBox.classList.add("d-none");

    // Filter: استخراج الطلاب المتعثرين

    const strugglingStudents = studentsList.filter(

        student =>

            student.average >= 40 &&

            student.average <= 49

    );

    // Map: إضافة 5 درجات رأفة للمتوسط

    const adjustedStudents = strugglingStudents.map(

        student => {

            return {

                name: student.name,

                newAverage: student.average + 5

            };

        }

    );

    // Reduce: جمع المتوسطات الجديدة

    const total = adjustedStudents.reduce(

        (sum, student) =>

            sum + student.newAverage,

        0

    );

    // حساب المتوسط العام مع منع القسمة على صفر

    const finalAverage =

        adjustedStudents.length > 0

            ? total / adjustedStudents.length

            : 0;

    // ==================================

    // 6. عرض التقرير باستخدام Template Literals

    // ==================================

    reportBox.innerHTML = `

        <h5>تقرير لجنة الرأفة</h5>

        <p>

            عدد الطلاب المتعثرين:

            <strong>${adjustedStudents.length}</strong>

        </p>

        <p>أسماء الطلاب ودرجاتهم بعد الرأفة:</p>

        ${

            adjustedStudents.length > 0

            ? `

                <ul>

                    ${adjustedStudents.map(student => `

                        <li>

                            ${student.name}

                            - المتوسط بعد الرأفة:

                            ${student.newAverage.toFixed(2)}

                        </li>

                    `).join("")}

                </ul>

            `

            : "<p>لا يوجد طلاب متعثرون في الوقت الحالي</p>"

        }

        <hr>

        <p>

            المتوسط العام بعد الرأفة:

            <strong>

                ${

                    adjustedStudents.length > 0

                    ? finalAverage.toFixed(2)

                    : "لا يوجد"

                }

            </strong>

          </p>

    `;

};