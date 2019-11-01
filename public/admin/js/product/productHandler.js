// variable fron modal
const titleForm = $('#title-form');
const buttonName = $('#name-button');
const display = $("#display") ;
const form = $("#form-add");
const titleProduct = $("#titleProduct");
const imgUrl = $("#image");
const price = $("#price");
const numbers = $('#numbers');
let oldNumbers;
const barcode = $("#barcode");
const description = $("#description");
const closemodal = $("#closemodal");
const modalNew = $("#my-product-dialog-new");
const modalEdit = $("#my-product-dialog-edit");
const spinner = $('#spinner');
const editClose = $("#editclose");
spinner.hide();


// handle for create and edit button click
$('.closemodal').on('click',()=>{
  $('#my-product-dialog-new').modal('toggle');
  $(".modal-backdrop").remove();
});

$('.closemodaledit').on('click',()=>{
  $('#my-supplier-dialog-edit').modal('toggle');
  $(".modal-backdrop").remove();
})

// when you choose file, filename will append in the label.
$(".custom-file-input").on("change", function() {
  const fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

// api getProdudc with pageNo, size
const getProducts = async (pageNo,size) => {
  spinner.show();
  $('#spnnier-backdrop').addClass('modal-backdrop');
  try{
    const result = await fetch(`/admin/getProducts?pageNo=${ pageNo }&size=${ size }`, { method: "get" });
    const data = await result.json();
    displayProduct(data, pageNo, size);
    spinner.hide();
    $('#spnnier-backdrop').removeClass('modal-backdrop');
  } catch (err) {
    console.log(err);
    spinner.hide();
    $('#spnnier-backdrop').removeClass('modal-backdrop');
    }
};
getProducts(1, 10);

// fix này lại sau
$('#show_paginator').bootpag({
  total: 10,
  page: 1,
  maxVisible: 10
}).on('page', function(event, num){
  getProducts(num,10);
});

// buildTemplate to show in table
const buildTemplate = (product, ids) =>{
  return `
    <tr id="${ids.listItemID}">
      <td>${ids.stt}</td>
      <td id="${ids.productID}">${product.title}</td>
      <td id="${ids.imgUrl}"><img style="height:40px; width:40px;" id="${ids.imgUrl}img" src="/${product.imgUrl}" /></td>
      <td id="${ids.price}">${product.price}</td>
      <td id="${ids.numbers}">${product.numbers}</td>
      <td id="${ids.barcode}">${product.barcode}</td>
      <td class="text-wrap" id="${ids.description}">${product.description}</td>
      <td>
        <div class="text-right">
          <button type="button" class="btn btn-secondary"
            id="${ids.detailID}"
            data-toggle="modal"
            data-target="#my-product-dialog-detail"
          >Detail
          </button>
          <button type="button" class="btn btn-secondary"
            id="${ids.editID}"
            data-toggle="modal"
            data-target="#my-product-dialog-edit"
          >Edit
          </button>
          <button type="button" class="btn btn-danger"
            id="${ids.deleteID}">Delete
          </button>
        </div>
      </td>
    </tr>
  `;
}
// build Id for itemList to know for delete or edit
const buildIDS = (product, page, size, index) => {
  return {
    stt: (page - 1) * size + index + 1,
    listItemID: "listItem_" + product._id,
    productID: "product_" + product._id,
    title: "title_" + product._id,
    barcode: "barcode_" + product._id,
    description: "description_" + product._id,
    imgUrl: "imgUrl_" + product._id,
    price: 'price_' + product._id,
    numbers: 'numbers_' + product._id,
    editID: product._id,
    deleteID: "delete_" + product._id,
    detailID: "detail_" + product._id
  }
}

// handle display product.
const displayProduct = (data, page, size) => {
  display.empty();
  data.forEach((product, index) => {
    let ids = buildIDS(product, page, size, index);
    display.append(buildTemplate(product, ids));
    detailProduct(product, ids);
    editProduct(product, ids);
    deleteProduct(product, ids);
  });
}

// handle reset product Input fields
resetproductInput = () => { 
  $('#titleProductEdit').val('');
  $('#priceEdit').val(''),
  $('#barcodeEdit').val(''),
  $('#descriptionEdit').val('')
  titleProduct.val('');
  $('.custom-file-label-edit')[0].innerText='Browser File';
  $('.custom-file-label')[0].innerText='Browser File';
  $('#image').val('')
  $('#imageEdit').val('')
  price.val('');
  barcode.val('');
  description.val('');
  numbers.val('');
}

// Create new product
form.submit(async (e) => {
  e.preventDefault();
  let formd = $('#form-add')[0];
  let formData = new FormData(formd);
  const json = JSON.stringify({
    title: titleProduct.val(),
    price: price.val(),
    barcode: barcode.val(),
    numbers: numbers.val(),
    description: description.val()
  });
  formData.append('file', $('#image'));
  formData.append('data', json);
  // show spinner and backdrop
  spinner.show();
  $('#spnnier-backdrop').addClass('modal-backdrop');
  try{
    const result = await fetch('/admin/product', {
      method: 'POST',
      body: formData,
    });
    const data = await result.json();
    modalNew.removeAttr("display");
    modalNew.attr("display","none");
    closemodal.trigger("click");
    resetproductInput();
    getProducts(1, 10);
    spinner.hide();
    $('#spnnier-backdrop').removeClass('modal-backdrop');
  } catch(err) {
    console.log(err);
    spinner.hide();
    $('#spnnier-backdrop').removeClass('modal-backdrop');
  }
});

$('#createNew').click(()=>{
  resetproductInput();
  form.removeAttr('method');
  form.attr('method', 'POST');
  numbers.attr('readonly', false);
  numbers.attr('disabled', false);
  titleForm.text('Thêm mới sản phẩm');
  buttonName.text('Thêm mới');
  setTimeout(() => {  
    if(modalNew.hasClass('show')){
      modalNew.css("display","block");
    }
  }, 500);
});

const editProduct = (product, ids) => {
  let editBtn = $(`#${ids.editID}`);
  const prodId = `${ids.editID}`;
  editBtn.click( async () => {
    console.log(product)
    console.log(`#${ids.editID}`);
    spinner.show();
    $('#spnnier-backdrop').addClass('modal-backdrop');
    try{
      const result = await fetch(`/admin/product/${product._id}`, { method: "get" });
      const data = await result.json();
      $('#titleProductEdit').val(`${data.title}`);
      $('#numbersEdit').val(`${data.numbers}`);
      $('#priceEdit').val(`${data.price}`);
      $('#numbersEdit').attr('readonly', true);
      $('#numbersEdit').attr('disabled', true);
      $('#numbersEdit').val(`${data.numbers}`);
      $('#barcodeEdit').val(`${data.barcode}`);
      $('#descriptionEdit').val(`${data.description}`);
      $("#my-product-dialog-edit").css("display","block");
      spinner.hide();
      $('#spnnier-backdrop').removeClass('modal-backdrop');
      $('#form-edit').submit(async (e) => {
        e.preventDefault();
        spinner.show();
        $('#spnnier-backdrop').addClass('modal-backdrop');
        let formd = $('#form-edit')[0];
        let formData = new FormData(formd);
        const json = JSON.stringify({
          title: $('#titleProductEdit').val(),
          price: $('#priceEdit').val(),
          barcode: $('#barcodeEdit').val(),
          description: $('#descriptionEdit').val()
        });
        formData.append('file', $('#imageEdit'));
        formData.append('data', json);
        const result = await fetch(`/admin/products/product/${prodId}`,{
          method: "put",
          body: formData
        });
        editClose.trigger("click");
        const data = await result.json();
          if (data._id) {
            // Display new data.
            const productIndex = $(`#${ids.productID}`);
            productIndex.text(titleProduct.val() ? titleProduct.val() : data.title);
            const nimgUrl = $(`#${ids.imgUrl}img`);
            nimgUrl.attr('src', `/${data.imgUrl}`);
            const nprice = $(`#${ids.price}`);
            nprice.text(price.val() ? price.val() : data.price);
            const nbarcode = $(`#${ids.barcode}`);
            nbarcode.text(barcode.val() ? barcode.val() : data.barcode);
            const ndescription = $(`#${ids.description}`);
            ndescription.text(description.val() ? description.val() : data.description);                  
            // Hide modal
            modalEdit.removeAttr("display");
            modalEdit.attr("display","none");
            resetproductInput();
            spinner.hide();
            $('#spnnier-backdrop').removeClass('modal-backdrop');
            $(".modal-backdrop").remove();
          }
      })
    } catch (err) {
      console.log(err);
      spinner.hide();
      $('#spnnier-backdrop').removeClass('modal-backdrop');
    }
  });
  
}


const detailProduct =  (product, ids) => {
  let detailBtn = $(`#${ids.detailID}`);
  detailBtn.click(async () => {
    spinner.show();
    $('#spnnier-backdrop').addClass('modal-backdrop');
    try{
      $('#title-form-detail').text('Chi tiết sản phẩm');
      const result = await fetch(`/admin/product/${product._id}`, { method: "get" });
      const data = await result.json();
      $('#titleProductDetail').val(`${data.title}`);
      $('#imgUrlDetail').attr("src",`/${data.imgUrl}`);
      $('#priceDetail').val(`${data.price}`);
      $('#numbersDetail').val(`${data.numbers}`);
      $('#barcodeDetail').val(`${data.barcode}`);
      $('#descriptionDetail').text(`${data.description}`);
      let tempString = '';
      await data.position.forEach(value => {
        tempString = tempString.concat(`row: ${value.row.toString()} floor: ${value.floor} index: ${value.index} \n`);
      })

      $('#positionDetail').text(`${tempString}`);
      $('#createDetail').text(`${data.createInfo.createTime}`);
      $("#my-product-dialog-detail").css("display","block");
      spinner.hide();
      $('#spnnier-backdrop').removeClass('modal-backdrop');
    } catch (err) {
      console.log(err);
      spinner.hide();
      $('#spnnier-backdrop').removeClass('modal-backdrop');
    }
    
  });
  
}

const deleteProduct = (product, ids) =>{
  let deleteBtn = $(`#${ids.deleteID}`);
  deleteBtn.click(async () => {
    spinner.show();
    $('#spnnier-backdrop').addClass('modal-backdrop');
    try {
      const result = await fetch(`/admin/product/${product._id}/barcode/${product.barcode}`,{
        method: "delete"
      });
      const data = await result.json();
      $(`#${ids.listItemID}`).remove();
      spinner.hide();
      $('#spnnier-backdrop').removeClass('modal-backdrop');
    } catch (err) {
      console.log(err);
      spinner.hide();
      $('#spnnier-backdrop').removeClass('modal-backdrop');
    }
  });
}   

