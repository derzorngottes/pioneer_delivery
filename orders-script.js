$(document).ready(function() {
  'use strict';
  var subtotal = 0;
  var tax = 0;
  var total = 0;
  var curItem = '';
  var curPrice = 0;
  var menuArr2 = [];
  var count = 0;
  var order = {};
  var orderFoods = {};
  var prevId = '';
  var thisTitle = '';
  var thisPrice = 0;

  function drawSection(menuArr2, i) {
    $('.titles').append('<p id="title' + i + '"></p>');
    thisTitle = '#title' + i;
    $(thisTitle).text(menuArr2[i].name);

    $('.prices').append('<p id="price' + i + '"></p>');
    thisPrice = '#price' + i;
    $(thisPrice).text(menuArr2[i].price);
  }

  function printMenu(data) {
    var menuArr = $.map(data, function(el) { return el; });
    menuArr2 = menuArr;

    $('.titles').append('<p class="headers">Burgers</p>');
    $('.prices').append('<p class="headers">&nbsp;</p>');

    for (var j = 0; j < menuArr.length; j++) {
      if (menuArr[j].type === 'burger') {
        drawSection(menuArr2, j);
        // $('.titles').append('<p id="title' + j + '"></p>');
        // thisTitle = '#title' + j;
        // $(thisTitle).text(menuArr[j].name);
        //
        // $('.prices').append('<p id="price' + j + '"></p>');
        // var thisPrice = '#price' + j;
        // $(thisPrice).text(menuArr[j].price);
      }
    }

    $('.titles').append('<p class="headers">Pizza</p>');
    $('.prices').append('<p class="headers">&nbsp;</p>');

    for (var i = 0; i < menuArr.length; i++) {
      drawSection(menuArr2, i);
      // $('.titles').append('<p id="title' + i + '"></p>');
      // thisTitle = '#title' + i;
      // $(thisTitle).text(menuArr[i].name);
      //
      // $('.prices').append('<p id="price' + i + '"></p>');
      // var thisPrice = '#price' + i;
      // $(thisPrice).text(menuArr[i].price);
    }
  }

  $.ajax({
    url: 'https://galvanize-eats-api.herokuapp.com/menu',
    dataType: 'json',
    type: 'GET',
    success: function(data) {
      printMenu(data);
    }
  });

  $('.titles').click(function() {
    $(prevId).css('background-color', '');
    var foodId = (event.target.id).substr(event.target.id.length - 1);
    var tempId = '#' + event.target.id;

    $(tempId).css('background-color', 'lightgrey');
    curItem = $(event.target).text();
    foodId = parseInt(foodId);
    curPrice = menuArr2[foodId].price;
    $('#numItems').val(1);
    prevId = tempId;
    $('#numItems').focus();
  });

  $('#addButton').click(function() {
    var foodCount = curItem;
    var numFoods = $('#numItems').val();

    orderFoods[foodCount] = curPrice;
    orderFoods[foodCount + 'Quantity'] = numFoods;

    subtotal += (parseFloat(numFoods * curPrice)).toFixed(2);
    tax = (parseFloat(subtotal * 0.1)).toFixed(2);
    total = (parseFloat(subtotal + tax)).toFixed(2);

    $('.sumUp').append('<p id="item' + count + '">' + curItem + ' (' + numFoods + ')</p>');
    $('.listPrice').append('<p id="price' + count + '">' + curPrice + '</p>');
    count += 1;

//    var displaySub = (parseFloat(subtotal)).toFixed(2);
//    var displayTax = (parseFloat(tax)).toFixed(2);
//    var displayTotal = (parseFloat(total)).toFixed(2);

    $('#showSubtotal').text('$' + subtotal);
    $('#showTax').text('$' + tax);
    $('#showTotal').text('$' + total);
  });

  $('#deliverButton').click(function() {
    var formData = $('form').serializeArray();

    order.name = formData[1].value;
    order.phone = formData[2].value;
    order.address = formData[3].value;
    order.total = (parseFloat(total)).toFixed(2);
    order.foods = orderFoods;

    $.ajax({
      url: 'https://galvanize-eats-api.herokuapp.com/orders',
      type: 'POST',
      data: order,
      success: function() {
        alert('Order successfully placed! Sit tight!');
      },
      error: function(xhr, status, error) {
        alert('Error: order not placed. Please try again later.');
      }
    });
  });
});
