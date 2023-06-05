const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');

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
                            <button class="edit-btn" >Edit</button>
                            <button class="delete-btn" >Delete</button>
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

productForm.addEventListener('submit',event=> {
    addProduct(event);
});

getProduct();