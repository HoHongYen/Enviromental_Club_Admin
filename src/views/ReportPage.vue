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

        <h1 class="title">Xuất báo cáo</h1>

        <button @click="exportExcel">
            Hiển thị dạng thu gọn
        </button>

        <div class="loading-overlay" id="loadingOverlay">
            <div class="loading-icon"></div>
        </div>

        <h1 class="title">Danh sách sinh viên</h1>

        <div class="student-activities">
            <!-- Các hoạt động sinh viên đã tham gia sẽ được hiển thị ở đây -->
            <table id="student-table" class="activity-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>HỌ TÊN</th>
                        <th>MSSV</th>
                        <th>NGÀNH HỌC - KHÓA</th>
                        <th>GHI CHÚ</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(student, studentIdx) in  students" :key="student.id">
                        <td>{{ studentIdx + 1 }}</td>
                        <td>{{ student.name }}</td>
                        <td>{{ student.mssv }}</td>
                        <td>{{ student.nganhkhoa }}</td>
                        <td>{{ totalScore(student.activities) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<script>

import { db } from '@/firebase';
import { collection, onSnapshot } from "firebase/firestore";

export default {
    name: 'ReportPage',
    data() {
        return {
            students: [],
        }
    },
    methods: {
        exportExcel() {
            $('#student-table').dataTable({

                dom: 'Bfrtip',
                lengthMenu: [
                    [10, 25, 50, -1],
                    ['10 dòng', '25 dòng', '50 dòng', 'Tất cả']
                ],
                buttons: [
                    'pageLength',
                    {
                        extend: 'excelHtml5',
                        title: 'Enviromental_Club_Report',
                        text: 'Xuất Excel',
                        title: 'Enviromental_Club_Report',
                        // title: 'HỘI SINH VIÊN TRƯỜNG ĐẠI HỌC CẦN THƠ',
                        // messageTop: "DANH SÁCH ĐỀ NGHỊ XÁC NHẬN THÀNH TÍCH THAM GIA HOẠT ĐỘNG",
                        //Columns to export
                        //exportOptions: {
                        //     columns: [0, 1, 2, 3,4,5,6]
                        // }
                    },
                    {
                        extend: 'pdfHtml5',
                        title: 'Enviromental_Club_Report',
                        text: 'Xuất PDF'
                        //Columns to export
                        //exportOptions: {
                        //     columns: [0, 1, 2, 3, 4, 5, 6]
                        //  }
                    }
                ]
            });
        },

        // exportExcel() {
        //     const uri = 'data:application/vnd.ms-excel;base64,';
        //     const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';

        //     const base64 = (s) => window.btoa(unescape(encodeURIComponent(s)));

        //     const format = function (template, context) {
        //         return template.replace(/{(\w+)}/g, (m, p) => context[p])
        //     };

        //     const html = document.getElementById('student-table').innerHTML;
        //     const ctx = {
        //         worksheet: 'Worksheet',
        //         table: html,
        //     };

        //     const link = document.createElement("a");
        //     link.download = "CLB_Moi_truong.xls";
        //     link.href = uri + base64(format(template, ctx));
        //     link.click();
        // },

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
        });
    },
}
</script>

<style></style>