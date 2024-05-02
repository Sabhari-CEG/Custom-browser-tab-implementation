$(document).ready(function() {
    let tabIndex = 1;

    function createTab() {
        let newTabId = 'tab-' + tabIndex;
        let newIframeId = 'iframe-' + tabIndex;
        let tabTooltip = tabIndex === 1 ? "Welcome! Use the '+' button (or 'Alt' + 'N' keyboard shortcut) to add new tabs. You can drag to rearrange tabs." : "Press 'Alt' + 'left or right arrow' to toggle tabs and 'Alt' + 'W' to close active tab";

        let tabHtml = `<div class="tab" id="${newTabId}">
                          Tab ${tabIndex} <span class="close">&times;</span>
                          <div class="tooltip">${tabTooltip}</div>
                       </div>`;
        let iframeHtml = `<div class="iframe-container" id="container-${newTabId}" style="display:none;">
                          <input type="text" class="input-url" placeholder="Enter URL and press Enter" id="input-${newTabId}">
                          <iframe id="${newIframeId}" style="display:none;"></iframe>
                      </div>`;

        $('#tabs-bar').append(tabHtml);
        $('#content-area').append(iframeHtml);
        $('#' + newTabId).click(function() { switchTab(newTabId); });
        $('span.close', '#' + newTabId).click(function(event) { closeTab(newTabId, event); });

        $('#container-' + newTabId).resizable({
            handles: 'se', 
            minHeight: 150,
            minWidth: 300
        });

        $('#input-' + newTabId).on('keypress', function(e) {
            if (e.which == 13) {
                $('#' + newIframeId).show().attr('src', $(this).val());
            }
        });

        tabIndex++;
        switchTab(newTabId);
        makeTabsSortable();
    }

    function switchTab(tabId) {
        $('.tab').removeClass('active');
        $('.iframe-container').hide(); 
        $('#' + tabId).addClass('active');
        $('#container-' + tabId).show(); 
    }

    function closeTab(tabId, event) {
        if (event) {
            event.stopPropagation();
        }
        $('#container-' + tabId).remove();
        $('#' + tabId).remove();
        if ($('.tab.active').length === 0 && $('.tab').length > 0) {
            switchTab($('.tab').first().attr('id'));
        }
    }

    function makeTabsSortable() {
        $("#tabs-bar").sortable({
            items: ".tab",
            containment: "parent",
            axis: "x",
            stop: function(event, ui) {
                ui.item.click(); 
            }
        });
        $("#tabs-bar").disableSelection();
    }

    function cycleTabs(forward = true) {
        var currentTab = $('.tab.active');
        var nextTab = forward ? currentTab.next('.tab') : currentTab.prev('.tab');

        if (nextTab.length === 0) {
            nextTab = forward ? $('.tab:first') : $('.tab:last');
        }

        nextTab.click();
    }

    function closeCurrentTab() {
        var activeTab = $('.tab.active');
        if (activeTab.length) {
            closeTab(activeTab.attr('id'));
        }
    }

    $(document).keydown(function(e) {
        if (e.altKey && e.key === 'n') {  
            e.preventDefault();
            createTab();
        }  else if (e.altKey && e.key === 'ArrowRight') {  
            e.preventDefault();
            cycleTabs(true);
        } else if (e.altKey && e.key === 'ArrowLeft') {  
            e.preventDefault();
            cycleTabs(false);
        } else if (e.altKey && e.key === 'w') {  
            e.preventDefault();
            closeCurrentTab();
        }
    });

    $('#new-tab').click(createTab);
    createTab();
    makeTabsSortable();
});
