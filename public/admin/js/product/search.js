// Filter with search Input
$("#myInput").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#myTable tr").filter(function() {
  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

$(document).keyup((e) => {
  if (e.key === "Escape") { // escape key maps to keycode `27`
    $(".modal-backdrop").remove();
  }
}); 