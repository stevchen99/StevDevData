
$(function() {
  $.get("/users", function(users) {
    users.forEach(function(user) {
      $("<li></li>")
        .text(user.TECHNO)
        .appendTo("ul#users");
    });
  });
});

