<template>
    <main>
        <!-- navbar begin -->
        <div>
            <button class="navbar-button">
                <router-link class="navbar-router" to="/">
                    Trang chủ
                </router-link>
            </button>
            <button class="navbar-button">
                <router-link class="navbar-router" to="/report">
                    Xuất báo cáo
                </router-link>
            </button>
        </div>
        <!-- navbar end -->

        <h1 class="title">Cập nhật dữ liệu</h1>

        <div class="search-bar">
            <input type="text" id="studentID" v-model="csvUrl" placeholder="Nhập csv url...">
        </div>

        <button @click="resetDatabase">
            Cập nhật
        </button>

        <div class="loading-overlay" id="loadingOverlay">
            <div class="loading-icon"></div>
        </div>

        <h1 class="title">Danh sách sinh viên</h1>

        <div class="studentInfo">
            <div class="student-activities">
                <!-- Các hoạt động sinh viên đã tham gia sẽ được hiển thị ở đây -->
                <table id="student-table" class="activity-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>MSSV</th>
                            <th>Họ tên</th>
                            <th>Ngành học - Khóa</th>
                            <th>Hoạt động</th>
                            <th>Điểm</th>
                            <th>Tổng điểm</th>

                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="(student, studentIdx) in  students" :key="student.id">
                            <tr v-for="(activity, activityIdx) in  student.activities" :key="activity.name">
                                <td v-if="activityIdx == 0" :rowspan="student.activities.length">{{ studentIdx + 1 }}</td>
                                <td v-if="activityIdx == 0" :rowspan="student.activities.length">{{ student.mssv }}</td>
                                <td v-if="activityIdx == 0" :rowspan="student.activities.length">{{ student.name }}</td>
                                <td v-if="activityIdx == 0" :rowspan="student.activities.length">{{ student.nganhkhoa }}
                                </td>
                                <td>{{ activity.name }}</td>
                                <td>{{ activity.diem }}</td>
                                <td v-if="activityIdx == 0" :rowspan="student.activities.length">{{
                                    totalScore(student.activities) }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</template>

<script>

import axios from 'axios';
import { db } from '@/firebase';
import { collection, setDoc, onSnapshot, doc, deleteDoc } from "firebase/firestore";

export default {
    name: 'HomePage',
    data() {
        return {
            csvUrl: '',
            students: [],
        };
    },
    methods: {
        async processCSVData(data) {
            let rows = data.split('\n').splice(1);
            await rows.sort(function (a, b) {
                let x = a.split(',')[2].toLowerCase();
                let y = b.split(',')[2].toLowerCase();
                if (x < y) { return -1; }
                if (x > y) { return 1; }
                return 0;
            });

            let countActivity;
            for (let i = 1; i < rows.length;) {
                // for (let i = 1; i < 3; i++) {
                const rowData = rows[i].split(',');
                const studentData = {
                    name: rowData[1],
                    mssv: rowData[2],
                    nganhkhoa: rowData[3],
                    activities: [],
                };

                countActivity = 0;

                for (let j = i; j < rows.length; j++) {
                    const rowData = rows[j].split(',');
                    if (rowData[2] === studentData.mssv) {
                        const activity = {
                            name: rowData[4],
                            donvi: rowData[5],
                            diem: rowData[6],
                        };
                        countActivity += 1;
                        studentData.activities.push(activity);
                    } else {
                        i += countActivity;
                        break;
                    }
                }
                await this.addStudent(studentData);
            }
        },
        async resetDatabase() {
            await this.deleteAllStudents();

            document.getElementById("loadingOverlay").style.visibility = "visible";

            await axios.get(this.csvUrl).then((res) => {
                this.processCSVData(res.data);
            });
            Toast.fire({
                icon: 'success',
                title: 'Cập nhật dữ liệu thành công!'
            })
            document.getElementById("loadingOverlay").style.visibility = "hidden";
        },

        async addStudent(student) {
            await setDoc(doc(db, "students", student.mssv), student);
        },

        async deleteAllStudents() {
            this.students.forEach((student) => {
                deleteDoc(doc(db, "students", student.mssv));
            })
        },
        totalScore(activities) {
            let score = 0;
            activities.forEach(activity => {
                score += parseInt(activity.diem);
            });
            score = parseInt(score);
            score = (score > 10) ? 10 : score;
            return score;
        },
    },

    async created() {
        const colRef = collection(db, "students");
        onSnapshot(colRef, (snapshot) => {
            let res = [];
            snapshot.docs.forEach((doc) => {
                res.push({ ...doc.data(), id: doc.id });
            })
            this.students = res;
        })
    }
}
</script>

<style></style>