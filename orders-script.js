$(document).ready(function(){
  var subtotal = 0;
  var tax = 0;
  var total = 0;
  var curItem = '';
  var menuArr2 = [];
  var allChoices = [];
  var count = 0;
  var order = {};
  var orderFoods = {};
  var prevId = '';

  $.ajax({
    url: 'https://galvanize-eats-api.herokuapp.com/menu',
    dataType:'json',
    type: 'GET',
    success: function(data){
      printMenu(data);
    }
  });

  function printMenu(data){
    var menuArr = $.map(data, function(el){return el});
    menuArr2 = menuArr;
    for(var i = 0; i < menuArr.length; i++){
      $('.titles').append('<p id="title' + i + '"></p>');
      var thisTitle = '#title' + i;
      $(thisTitle).text(menuArr[i].name);

      $('.prices').append('<p id="price' + i + '"></p>');
      var thisPrice = '#price' + i;
      $(thisPrice).text(menuArr[i].price);
    }
  }

  $('.titles').click(function(){
    console.log(prevId);
    $(prevId).css('background-color', '');
    var foodId = (event.target.id).substr(event.target.id.length - 1);
    var tempId = '#' + event.target.id;
    $(tempId).css('background-color', 'lightgrey');
    curItem = $(event.target).text();
    foodId = parseInt(foodId);
    curPrice = menuArr2[foodId].price;
    $('#numItems').val(1);
    prevId = tempId;
  });

  $('#addButton').click(function(){
    var foodCount = curItem;
    var numFoods = $('#numItems').val();
    orderFoods[foodCount] = curPrice;
    orderFoods[foodCount + 'Quantity'] = numFoods;
    subtotal += numFoods * curPrice;
    tax = subtotal * 0.1;
    total = subtotal + tax;
    $('.sumUp').append('<p id="item' + count + '">' + curItem + ' (' + numFoods + ')</p>');
    $('.listPrice').append('<p id="price' + count + '">' + curPrice + '</p>');
    count += 1;
    var displaySub = (parseFloat(subtotal)).toFixed(2);
    var displayTax = (parseFloat(tax)).toFixed(2);
    var displayTotal = (parseFloat(total).toFixed(2));
    $('#showSubtotal').text('$' + displaySub);
    $('#showTax').text('$' + displayTax);
    $('#showTotal').text('$' + displayTotal);
  });

  $('#deliverButton').click(function(){
    formData =  $('form').serializeArray();
    order.name = formData[1].value;
    order.phone = formData[2].value;
    order.address = formData[3].value;
    order.total = (parseFloat(total)).toFixed(2);
    order.foods = orderFoods;

    $.ajax({
      url: "https://galvanize-eats-api.herokuapp.com/orders",
      type: "POST",
      data: order,
      success: function() {
        console.log('success');
        alert('completed');
      },
      error: function(xhr, status, error){
        console.log('error');
      }
    });
  });

});
