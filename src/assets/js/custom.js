"use strict";


    
// Artist detail and neighbour consent clone function for the submit permit form
//$(document).ready(function() {

  // Object to store counters for id generation
  var idCounters = {};

  // Function to hide the remove button if only one section is present
  function hideRemoveButton() {
    if ($('.artist-detail').length === 1) {
      $('#originalArtistDetail .remove-details').hide();
    }
    if ($('.neighbour-consent-details').length === 1) {
      $('#originalneighbour-consent-details .remove-neighbour-consent-details').hide();
    }
  }

  // Function to generate new id
  function generateNewId(originalId, isName = false) {
    if (originalId in idCounters) {
      idCounters[originalId]++;
    } else {
      idCounters[originalId] = isName ? 1 : 2; 
    }
    return originalId + idCounters[originalId];
  }

  // Function to update ids for cloned elements
  function updateElementIds(clone) {
    var uniqueGroupName = generateNewId('propertyType', true);

    clone.find('input, select, textarea').each(function() {
      var originalId = $(this).attr('id');
      var newId = generateNewId(originalId);

      $(this).attr('id', newId);
      $(this).val('');

      if ($(this).is(':radio')) {
        $(this).attr('name', uniqueGroupName);
        $(this).prop('checked', false);
      }

      var labels = $(this).parents('div.form-group').find('label');
      labels.each(function() {
        var originalFor = $(this).attr('for');
        if (originalFor === originalId) {
          var newFor = newId;
          $(this).attr('for', newFor);
        }
      });
    });
  }



  // Function to remove section
  function removeSection(element) {
    $(element).closest('.artist-detail, .neighbour-consent-details').prev().find('.add-details, .add-neighbour-consent-details').show();
    $(element).closest('.artist-detail, .neighbour-consent-details').prev().find('.remove-details, .remove-neighbour-consent-details').show();

    $(element).closest('.artist-detail, .neighbour-consent-details').remove();

    hideRemoveButton();
  }



//end Public art permit function

function windowScroll() {
  // Scroll to top
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn();
    } else {
      $(".back-to-top").fadeOut();
    }
  });
}

  function backToTop() {
  $(".back-to-top").click(function() {
    $("html, body").animate(
      {
        scrollTop: 0
      },
      800
    );
    return false;
  });

}

function PrintButton() {
  // Print button
  const printButton = document.querySelector(".print-page button");
  if (printButton) {
    printButton.addEventListener("click", function() {
      window.print();
    });
  }
}


function goBack() {
  window.history.go(-1);
}
function setGoBackButton() {
  try {
if (window.history.length <= 1) document.getElementById("gobackBtn").style.display = "none";
} catch(error) {}
}
  





