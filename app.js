const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productId = document.getElementById('product-id');

// tạo ra 1 mảng products để chứa danh sách product hứng từ 
// json server
let products = [];
// tạo ra hàm lấy danh sách sản phẩm từ json server 
function getProduct() {
    fetch('http://localhost:3000/products')
    .then(response => response.json())
    .then(data=>{
        products = data;
        displayProduct();
        //dữ liệu json server sẽ trả về là cục data
    })
    .catch(error => console.error())
}
function displayProduct() {
   
   // products
   productList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Tên SP</th>
                    <th>Giá</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product=>`
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.price}</td>
                        <td>
                            <button class="edit-btn" data-id="${product.id}" >Edit</button>
                            <button class="delete-btn" data-id="${product.id}">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            <tbody>
        </table>
   `;
}
function addProduct(event) {
    event.preventDefault(); // không bị load lại trang khi thêm
    // tạo ra 1 object product để thêm mới vào 
    const product = {
        name: productName.value,
        price: productPrice.value
    };
    fetch('http://localhost:3000/products',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(product) // ép về chuỗi JSON để nhồi dữ liệu mới vào product
    }).then(response=> response.json())
    .then(data=>{
        products.push(data); // đẩy dữ liệu mới vào mảng products
        displayProduct(); // gọi lại hàm hiển thị để cập nhập lại bảng 
    })
    .catch(error => console.error(error));
}
// lắng nghe sự kiện submit form để thêm sản phẩm 
// xây dựng hàm hiển thị thông tin trước khi chỉnh sửa 
function editProduct(event) {
    // lấy id khi người dùng ấn vào nút edit
    const productId1 = event.target.dataset.id;
    //lấy ra đối tượng product theo id 
    const product = products.find(product => product.id == productId1);
    // gán vào value 
    productName.value = product.name;
    productPrice.value = product.price;
    productId.value = product.id;
}
function updateProduct(event) {
    event.preventDefault();
    // khai báo 1 đối tượng product mới khi đã chỉnh sửa
    const product = {
        name : productName.value,
        price : productPrice.value
    }
    const productId = document.getElementById('product-id').value;
    fetch(`http://localhost:3000/products/${productId}`,{
        method: 'PUT', // phương thức push tương đương với sửa 
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(product) // ép về chuỗi JSON để nhồi dữ liệu mới vào product
    }).then(response=> response.json())
    .then(data=>{
        const index = products.findIndex(product => product.id == productId);
        products[index] = data;
        displayProduct(); // gọi lại hàm hiển thị để cập nhập lại bảng 
        // reset lại form
        productForm.reset();
    })
    .catch(error => console.error(error));
}
productForm.addEventListener('submit',event=> {
    //check nếu tồn tại productID thì gọi hàm update ngược lại gọi hàm add 
    if(productId.value) {
        updateProduct(event);
    } else {
        addProduct(event);
    }
});
function deleteProduct(event) {
    const productID = event.target.dataset.id;
    fetch(`http://localhost:3000/products/${productID}`,{
        method: 'DELETE',
    }).then(response=> {
         // xóa khỏi danh sách ở bộ nhớ tạm
         products = products.filter(product=>product.id != productID);
         displayProduct(); // gọi lại hàm hiển thị để cập nhập lại bảng 
    })
   
    .catch(error => console.error(error));
}
// lắng nghe sự kiện khi click nút edit để bắt dữ liệu lên ô input
productList.addEventListener('click',event=>{

    // khi người dùng ấn vào nút edit-btn
    if(event.target.classList.contains('edit-btn')) {
         editProduct(event);
        // console.log(123);
    }
});
productList.addEventListener('click',event=>{

    // khi người dùng ấn vào nút edit-btn
    if(event.target.classList.contains('delete-btn')) {
         deleteProduct(event);
        // console.log(123);
    }
});

getProduct();