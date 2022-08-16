// -----------------------------------------------user menu 
$('.nav_menu_profile').click(function () {
    var menu_profile = $(this).data("modal");
    $(menu_profile).toggleClass('visible');
});
$(document).click(function (event) {
	//if you click on anything except the modal itself or the "open modal" link, close the modal
	if (!$(event.target).closest(".nav_menu_profile").length) {
		$("body").find(".menu_profile ").addClass("visible");
	}
});

// -----------------------------------------------tab 
$('ul.tabs li').click(function () {
    var $this = $(this);
    var $theTab = $(this).attr('id');
    console.log($theTab);
    if ($this.hasClass('active')) {
        // do nothing
    } else {
        $this.closest('.tabs_wrapper').find('ul.tabs li, .tabs_container .tab_content').removeClass('active');
        $('.tabs_container .tab_content[data-tab="' + $theTab + '"], ul.tabs li[id="' + $theTab + '"]').addClass('active');
    }

});

// ----------------------------------------------modal
$(".pop_btn").on("click", function () {
    var modal = $(this).data("modal");
    $(modal).fadeIn();
});

$(".close, .modal_dialogue").click(function () {
    $(this).closest(".modal").fadeOut();
    // location.reload();
});

// ----------------------------------------------filter
$(".pop_f_btn").on("click", function () {
    var filter = $(this).data("modal");
    $(filter).fadeIn();
});

$(".close, .filter_dialogue").click(function () {
    $(this).closest(".filter").fadeOut();
    // location.reload();
});


// ----------------------------------------------dropdown

$('.options').click(function () {
  var dropDMenu = $(this).data("modal");
  $(dropDMenu).toggleClass('visible');
});

$(document).click(function (event) {
	if (!$(event.target).closest(".options").length) {
		$("body").find(".dropDMenu").addClass('visible');
	}
});

// ----------------------------------------------dropdown

$('.select_drop').click(function () {
  var optionMenu = $(this).data("modal");
  $(optionMenu).slideDown('fast');
});

$(document).click(function (event) {
	if (!$(event.target).closest(".select_drop").length) {
		$("body").find(".optionMenu").slideUp('fast');
	}
});


//   ---------------------------------------- tr clickable

$(function(){
  $('*[data-href]').on('click', function() {
       window.location = $(this).data("href");
  });
})

// ----------------------------------------------date picker
$( function() {
  $( "#datepicker_from, #datepicker_to, #cp_reg_date" ).datepicker({
    dateFormat: "dd MM, yy",	
    duration: "fast",
    changeMonth: true,
    changeYear: true
  });
} );
// $('#demo').daterangepicker({
//     showISOWeekNumbers: true,
//     autoUpdateInput: true,
//     applyButtonClasses: 'd-none',
//     showDropdowns: false,
//     opens: "center",
//     drops: "down",
//     autoApply: true,
//     linkedCalendars: true,
//     showCustomRangeLabel: false,
//     startDate: 1,
//     endDate: 1,
//     locale: {
//       format: "DD/MM/YYYY",
//       separator: " - ",
//       applyLabel: "Apply",
//       cancelLabel: "Calcel",
//       fromLabel: "From",
//       toLabel: "To",
//       customRangeLabel: "Custom",
//       weekLabel: "W",
//       daysOfWeek: [
//         "Su",
//         "Mo",
//         "Tu",
//         "We",
//         "Th",
//         "Fr",
//         "Sa"
//       ],
//       monthNames: [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December"
//       ],
//       firstDay: 1
//     }
//   });

//   ----------------------------------------fileupload

const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("custom-button");
const customTxt = document.getElementById("custom-text");

customBtn.addEventListener("click", function() {
  realFileBtn.click();
});

realFileBtn.addEventListener("change", function() {
  if (realFileBtn.value) {
    customTxt.innerHTML = realFileBtn.value.match(
      /[\/\\]([\w\d\s\.\-\(\)]+)$/
    )[1];
  } else {
    customTxt.innerHTML = "No file chosen, yet.";
  }
});
