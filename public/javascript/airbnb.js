
(function() {
  var recordsMap = {};

  var recordTemplate;
  var recordDetailTemplate;

  var overlay;
  var filterPanel;

  var filterPanelShowing = true;
  var displayedRecord = null;

  var methods = {

    init: function() {
      overlay = $('#overlay');
      filterPanel = $('#filter-panel');

      // Compile templates.
      var source = $('#record-template').html();
      recordTemplate = Handlebars.compile(source);

      source = $('#record-detail-template').html();
      recordDetailTemplate = Handlebars.compile(source);

      // Handle filter panel button.
      $('#filter-btn').on('click', function() {
        methods.showFilterPanel(!filterPanelShowing);
      });

      // Handle add new record button.
      $('#new-rental-btn').on('click', function() {
        $('#addRentalModal').modal('show');
      });

      // Handle filter panel submits.
      $('#query-submit').on('click', function() {
        methods.renderRecords();
      });

      // Handle Enter and Esc keys.
      $(document).keyup(function(e) {
        if (e.which == 27) {  // Esc
          $('#myModal').modal('hide');
          $('#addRentalModal').modal('hide');
          methods.showFilterPanel(false);
        }
      });

      $('#query-checkin').datepicker();
      $('#query-checkout').datepicker();

      $('#addon-checkin').on('click', function() {
        $('#query-checkin').datepicker('show');
      });

      $('#addon-checkout').on('click', function() {
        $('#query-checkout').datepicker('show');
      });

      methods.renderRecords();
    },

    drawRecordDetail: function(data) {
      displayedRecord = data;
      var html = recordDetailTemplate(data);
      $('#modal-container').empty().append(html);
      $('#myModal').modal('show');
    },

    bookRental: function() {
      // TODO(andytzou): To be implemented.
    },

    showFilterPanel: function(showPanel) {
      filterPanelShowing = showPanel;
      var panelHeight = filterPanel.css('height');

      if (filterPanelShowing) {
        filterPanel.show();
        filterPanel.css({
          'webkit-transform': 'translate3d(0, 0, 0)',
          'moz-transform': 'translate3d(0, 0, 0)',
          'transform': 'translate3d(0, 0, 0)'
        });
      } else {
        filterPanel.css({
          'webkit-transform': 'translate3d(0, -' + panelHeight + ', 0)',
          'moz-transform': 'translate3d(0, -' + panelHeight + ', 0)',
          'transform': 'translate3d(0, -' + panelHeight + ', 0)'
        });
      }
    },

    renderRecords: function() {
      overlay.show();
      var params = {
        url: 'http://xanadu.logicparty.org:4000/rentals',
        dataType: 'jsonp',

        data: {
          type: $('#query-type').val(),
          capacity: $('#query-guests').val(),
          checkin: $('#query-checkin').val(),
          checkout: $('#query-checkin').val(),
          price: $('#query-price').val()
        },

        success: function(records) {
          var mainContent = $('#main-content');
          var currentRecordRow = null;
          var targetDiv = $('<div>');

          var children = $('#main-content').children().not('#filter-panel');
          for (var i = 0; i < children.length; i++) {
            children[i].remove();
          }

          for (var i = 0; i < records.length; i++) {
            var data = {
              id: records[i].id,
              image: 'http://xanadu.logicparty.org:4000' + records[i].image_urls[0],
              title: records[i].title,
              price: '$' + records[i].price + ' per night',
              subtitle: records[i].type + ' - ' + records[i].location
            };

            recordsMap[records[i].id] = data;
            var html = recordTemplate(data);

            if (i % 3 === 0) {
              currentRecordRow = $('<div>');
              currentRecordRow.addClass('row-fluid');
            }

            currentRecordRow.append(html);
            mainContent.append(currentRecordRow);
          }

          overlay.hide();

          $('.record-panel').on('click', function(e) {
            methods.drawRecordDetail(recordsMap[e.currentTarget.id]);
          });
        }
      };

      jQuery.ajax(params);
    }
  }; // End methods.

  window.AirBnb = methods;
})();

