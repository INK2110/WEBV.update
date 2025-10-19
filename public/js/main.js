document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // 1. Form Validation
    // ===================================
    const form = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm_password');
    const errorDiv = document.getElementById('passwordError');

    if (form && passwordInput && confirmPasswordInput && errorDiv) {
        form.addEventListener('submit', (event) => {
            if (passwordInput.value !== confirmPasswordInput.value) {
                errorDiv.textContent = 'รหัสผ่านทั้งสองช่องไม่ตรงกัน';
                errorDiv.style.color = 'red';
                event.preventDefault();  // ป้องกันการส่งฟอร์มแล้วโหลดหน้าใหม่
            } else {
                errorDiv.textContent = '';
            }
        });
    }

    // ===================================
    // 2. Modal เปิด/ปิด (แบบธรรมดา)
    // ===================================
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.getElementById('closeModal');
    const modal = document.getElementById('modal');

    if (openBtn && closeBtn && modal) {
        // เปิด Modal
        openBtn.addEventListener('click', () => {
            modal.classList.add('open');
        });

        // ปิด Modal
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('open');
        });

        // ปิดเมื่อคลิกพื้นหลังดำ
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });

        // ปิดด้วยปุ่ม ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                modal.classList.remove('open');
            }
        });
    }

    // ===================================
    // 3. Click Event - Table & List
    // ===================================
    document.addEventListener('click', function(e) {
            
            // === เช็ค li ก่อน (สำหรับ reportBox) ===
        const li = e.target.closest('li.report-item');
        const reportBox = e.target.closest('#reportBox_lastest');

        if (li && reportBox) {
            const problemLastestData = {
                problemId: li.dataset.problemId,
                title: li.dataset.title,
                description: li.dataset.description,
                status: li.dataset.status,
                priority: li.dataset.priority,
                createat: li.dataset.createat,
                createby: li.dataset.createby,
                department: li.dataset.department,
                location: li.dataset.location
            };
            
            if (problemLastestData.title && problemLastestData.title !== '-') {

                openProblemDetail(problemLastestData);
            } else {
                console.warn('ไม่มีข้อมูลใน dataset');
            }
            return; // จบเคส li
        }

        // === เช็ค td (สำหรับตาราง) ===
        const td = e.target.closest('td');
        if (!td) return;

        const row = td.closest('tr');
        if (!row) return;

        // หา table ที่ td นี้อยู่ในนั้น
        const table = td.closest('table');
        if (!table) return;

        // หา <th id="th_description"> ภายในตารางนั้นโดยเฉพาะ
        const descriptionHeader = table.querySelector('th#th_description');
        if (!descriptionHeader) return; // ถ้าไม่มีคอลัมน์นี้ก็ข้ามไปเลย

        // หา index ของคอลัมน์ description ภายในตารางนั้น
        const headers = Array.from(descriptionHeader.parentElement.children);
        const descriptionColumnIndex = headers.indexOf(descriptionHeader);

        // หาว่าคลิกอยู่คอลัมน์ไหน
        const cells = Array.from(row.children);
        const columnIndex = cells.indexOf(td);

        // ถ้าคลิกในคอลัมน์รายละเอียด
        if (columnIndex === descriptionColumnIndex) {
            // สร้าง object problemData โดยอิงจาก id ของ <th>
            const data = {};
            headers.forEach((header, idx) => {
                const id = header.id?.replace(/^th_/, ''); // เช่น 'th_title' -> 'title'
                if (id){
                     data[id] = cells[idx]?.textContent.trim() || '';
                }
                
                
            });

            // axios.get(`/getAssignedUser/${data.problemId}`)
            // .then(res => {
            //      data.assignby = res.data;
            //     // console.log(data23);
            // }).catch(error => {
            //     console.log("Getting worker Error" , error);
            // })

            
            
            
            const createbyHeader = table.querySelector('th#th_createby');
            
                // ถ้าไม่มี header 'th_createby'
             if (!createbyHeader) {
                data.createby = row.dataset.createby || '-';
             }           
             
            
          //  data.createby = td.closest("tr")?.dataset.createby || '-';
             
            console.log('ข้อมูลจากตาราง:', data);
            
            openProblemDetail(data);
        }


        
        
    });


    const acceptBtn = document.getElementById("acceptButton");
        if (acceptBtn) {
            
    
            acceptBtn.addEventListener("click", (e) => {
                
                const problemId = e.target.dataset.problemId;
                const statusstate = e.target.dataset.status;
                isProcessing = true;
                acceptBtn.disabled = true;

                axios.post(`/main/problem/accept/${problemId}`, {
                        statusstate: statusstate 
                        
                })
                
                .then(res => {
                    const result = res.data; 
                    if (result.success) {
                        alert("รับงานเรียบร้อย");
                        location.reload(); // โหลดตารางใหม่
                    } 
                    
                    
                })

                .catch(err => {

                     if(err.message){
                        alert(err.response.data.message);
                        location.reload();
                        console.log(err);
                     }
                     
                console.error("เกิดข้อผิดพลาด:", err);
                });

                console.log("รับงานหมายเลข:", problemId);
            });
            
        }

    const workCancelbtn = document.getElementById("workCancelbtn");
    if(workCancelbtn) {
        workCancelbtn.addEventListener("click", (e) => {
            
            if(confirm("คุณต้องการยกเลิกงานนี้ใช่หรือไม่?")){
                
                const problemId = e.target.dataset.problemId;
                console.log("ยกเลิกงานหมายเลข:", problemId);
                axios.post(`/main/problem/cancel/${problemId}`)
            
                .then(res => {
                    result = res.data;
                    if (result.success) {
                        alert("ยกเลิกงานเรียบร้อย");
                        location.reload(); // โหลดตารางใหม่
                    }
                })
                .catch(err => {
                console.error("เกิดข้อผิดพลาด:", err);
                alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
                });
        }else{

        }
        });
    }

    const editsection = document.getElementById("editsectionshow");
    const editconfirmbtn = document.getElementById("editconfirmbtn");
    const workUpdatebtn = document.getElementById("workUpdatebtn");
    const optionsection = document.getElementById("optionsection");
    if(workUpdatebtn) {
        let n = 0;
        workUpdatebtn.addEventListener("click", (e) => {
            n++;
            if(n%2==1){
                 editsection.style.display = "flex";
            }
            else{
                 editsection.style.display = "none";
                 optionsection.value = "";
                 
            }
        if(n==10) n=0;
        

        });

        editconfirmbtn.addEventListener("click", (e) => {
            
            const problemId =  workUpdatebtn.dataset.problemId;
            if(optionsection.value >= 2){
                axios.post(`/main/problem/update/${problemId}`, {
                    statusid: optionsection.value
                    })
                    .then(res => {
                        if (res.data.success == true) {
                        alert("อัพเดทสถานะเรียบร้อย");
                        location.reload(); // โหลดตารางใหม่
                       
                        }
                    })
                    .catch(err => console.error(err));
            }


        });

    }
    const workFinishbtn = document.getElementById("workFinishbtn");
    if(workFinishbtn) {
        workFinishbtn.addEventListener("click", (e) => {
            if(confirm("คุณต้องการเสร็จสิ้นงานนี้ใช่หรือไม่?")){
                const problemId = e.target.dataset.problemId;
                const datetime = new Date();
                axios.post(`/main/problem/update/${problemId}`, {
                    statusid: 4,
                    finishat : datetime
                    })
                    .then(res => {
                        if (res.data.success == true) {
                        alert("ปิดงานเรียบร้อย");
                        location.reload(); // โหลดตารางใหม่
                        }
                    })
                    .catch(err => console.error(err));
                console.log("ปิดงานหมายเลข:", problemId);
            }
        });
    }


  const attachBtn = document.getElementById("attachBtn");
  const fileInput = document.getElementById("fileInput");
  const previewArea = document.getElementById("previewArea");
  if(attachBtn && fileInput && previewArea){
  // ====================================================
  // =========== เมื่อคลิกปุ่ม attach → เปิดเลือกไฟล์ ===========
  // ====================================================
  attachBtn.addEventListener("click", () => fileInput.click());

  // เมื่อผู้ใช้เลือกไฟล์
  fileInput.addEventListener("change", (event) => {
    const files = Array.from(event.target.files);
    previewArea.innerHTML = ""; // เคลียร์ preview เดิม

    files.forEach(file => {
      const fileType = file.type;
      const fileBox = document.createElement("div");
      fileBox.classList.add("preview-box");

      // ถ้าเป็นรูป (jpg, png)
      if (fileType.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.alt = file.name;
          img.classList.add("preview-thumb");

          const name = document.createElement("p");
          name.textContent = file.name;
          name.classList.add("preview-name");

          fileBox.appendChild(img);
          fileBox.appendChild(name);
          previewArea.appendChild(fileBox);
        };
        reader.readAsDataURL(file);
      }
      // ถ้าเป็น PDF
      else if (fileType === "application/pdf") {
        const icon = document.createElement("div");
        icon.classList.add("pdf-icon");
        icon.textContent = "📄";

        const name = document.createElement("p");
        name.textContent = file.name;
        name.classList.add("preview-name");

        fileBox.appendChild(icon);
        fileBox.appendChild(name);
        previewArea.appendChild(fileBox);
      }
    });
  });

    }

    
    
}); // ปิด DOMContentLoaded

// ฟังก์ชันเปิด modal และดึงข้อมูลปัญหา
function openProblemDetail(problemData) {
    selectedProblemId = problemData.problemid; // เก็บ id ไว้ใช้ update
    const modal = new bootstrap.Modal(document.getElementById('problemDetailModal'));
    modal.show();

    // ถ้าเป็น Admin ให้โหลด dropdown
    if (window.userRole === "Admin") {
        document.getElementById("adminEditSection").style.display = "block";

        loadAdminDropdowns(problemData);
    } else {
        document.getElementById("adminEditSection").style.display = "none";
    }
}

// ฟังก์ชันโหลด dropdown ของ admin
//  function loadAdminDropdowns(problemData) {
//   console.log("กำลังโหลด dropdowns...");

//   // 🔹 โหลดผู้รับผิดชอบ
//   const assignDropdown = document.getElementById("assignDropdown");
//   if (assignDropdown) {
//     assignDropdown.innerHTML = ""; // เคลียร์ของเดิม
//     const assignby = problemData.assignby;
//     console.log(assignby);
//     axios.get("/main/assigned:problemId")
//       .then(res => {
//         const users = res.data;
//         users.forEach(user => {
//           const option = document.createElement("option");
//           option.value = user.usersid;
//           option.textContent = user.fullname;
//           if (problemData.assignid == user.usersid) option.selected = true;
//           assignDropdown.appendChild(option);
//         });
//         console.log("โหลดผู้รับผิดชอบสำเร็จ:", users);
//       })
//       .catch(err => console.error("โหลดผู้รับผิดชอบผิดพลาด:", err));
//   }

//   // 🔹 โหลดสถานะ
//   const statusDropdown = document.getElementById("statusDropdown");
//   console.log("statusDropdown =", statusDropdown);
//   if (statusDropdown) {
//     let loadedstatus = false;
//     statusDropdown.addEventListener("click", () => {
//       if (loadedstatus) return;

//       axios.get("/main/status")
//       .then(res => {
//         const statuses = res.data;
//         console.log(statuses);
//         statuses.forEach(status => {
//           const option = document.createElement("option");
//           option.value = status.statusid;
//           option.textContent = status.statusstate;
//           // if (problemData.statusid == status.statusid) option.selected = true;
//           statusDropdown.appendChild(option);
//         });
//         loadedstatus = true;
//         console.log("โหลดสถานะสำเร็จ:", statuses);
//       })
//       .catch(err => console.error("โหลดสถานะผิดพลาด:", err));
//     });
//     // statusDropdown.innerHTML = ""; // เคลียร์ของเดิม
    
//   }
// }



// ปุ่มบันทึก admin
// document.getElementById("saveAdminEdit").addEventListener("click", () => {
//     if (!selectedProblemId) return alert("ไม่พบ Problem ID");

//     const data = {
//         problemid: selectedProblemId,
//         assignid: document.getElementById("assignDropdown").value,
//         statusid: document.getElementById("statusDropdown").value,
//         priorityid: document.getElementById("priorityDropdown").value
//     };

//     axios.post("/main/admin/updateProblem", data)
//         .then(res => {
//             if(res.data.success){
//                 alert("แก้ไขเรียบร้อย");
//                 location.reload(); // หรือเรียก fetch table ใหม่
//             } else {
//                 alert("เกิดข้อผิดพลาด: " + res.data.message);
//             }
//         })
//         .catch(err => {
//             console.error(err);
//             alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
//         });
// });

// ===================================
// 4. ฟังก์ชันเปิด Modal (ใช้ Bootstrap)
// ===================================
window.openProblemDetail = function(problemData) {
    const modalElement = document.getElementById('problemDetailModal');
    if (!modalElement) return;

    // แสดง admin section
    // document.getElementById("adminEditSection").style.display = "block";

    // โหลด dropdown ตอน modal เปิดแล้ว
    // loadAdminDropdowns(problemData);

    const acceptBtn = document.getElementById("acceptButton");
    const workUpdatebtn = document.getElementById("workUpdatebtn");
    const workCancelbtn = document.getElementById("workCancelbtn");
    const workFinishbtn = document.getElementById("workFinishbtn"); 

    
    // เช็คว่า Modal มีอยู่จริง
    if (!modalElement) {
        console.error('ไม่พบ Modal element');
        return;
    }
    if (acceptBtn) {
        acceptBtn.dataset.problemId = problemData.problemId;
        acceptBtn.dataset.status = problemData.status;
        console.log("acceptBtn", acceptBtn.dataset.problemId);
        console.log("acceptBtn", acceptBtn.dataset.status);
    }
    if(workUpdatebtn && workCancelbtn && workFinishbtn) {
        workCancelbtn.dataset.problemId = problemData.problemId;
        workUpdatebtn.dataset.problemId = problemData.problemId;
        workFinishbtn.dataset.problemId = problemData.problemId;
        
        console.log("workUpdatebtn", workUpdatebtn.dataset.problemId);
        console.log("workCancelbtn", workCancelbtn.dataset.problemId);
        console.log("workFinishbtn", workFinishbtn.dataset.problemId);
    }
    
   
    
    
    
    
    const modal = new bootstrap.Modal(modalElement);

    
    
    // อัพเดทข้อมูลใน Modal
    const titleElement = document.getElementById('problemDetailModalLabel');
    const detailElement = document.getElementById('problemDetail');
    const statusElement = document.getElementById('problemStatus');
    const priorityElement = document.getElementById('problemPriority');
    const createDateElement = document.getElementById('createDate');
    const createrElement = document.getElementById('creater');
    const creadtedByDepartmentElement = document.getElementById('creadtedByDepartment');
    const createdLocationElement = document.getElementById('createdLocation');


    if (titleElement) {
        titleElement.innerHTML = '<i class="fas fa-info-circle me-2"></i>' + 
                                 (problemData.title || 'ชื่องาน');
    }
    
    // แสดงข้อมูลอื่นๆ ด้วย
    if (detailElement) 
        detailElement.textContent = problemData.description || '-';
    if (statusElement) 
        statusElement.textContent = problemData.status || '-';
        
    if (priorityElement) 
        priorityElement.textContent = problemData.priority || '-';
    if (createDateElement)
        createDateElement.textContent = problemData.createat || '-';
    if (createrElement)
        createrElement.textContent = problemData.createby || '-';

    if (creadtedByDepartmentElement)
        creadtedByDepartmentElement.textContent = problemData.department || '-';
    if (createdLocationElement)
        createdLocationElement.textContent = problemData.location || '-';
    
    

    modal.show();

   
};


