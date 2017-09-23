$(document).ready(function () {
  // Swiper slider
  var swiper

  // Lazy loader
  var lazy = new LazyLoad()

  // Check if images are loaded
  imgLoaded = false

  // Remember the scroll location
  var scrollLocation = $(document).scrollTop()

  // Initialize Materialize plugins
  $('.button-collapse').sideNav()
  $('.modal').modal()
  $('select').material_select()
  $('#slideout-close').on('click', function () {
    $('.button-collapse').sideNav('hide')
  })

  // Get the theme JSON file
  $.getJSON('/themes.json', function (returnedThemes) {
    var masterThemeList = returnedThemes

    // Hide the loader
    $('#loader').hide()

    // Compile Handlebars templates
    var themeTemplate = Handlebars.compile($('#themeTemplate').html())
    var themePageTemplate = Handlebars.compile($('#themePageTemplate').html())
    var featureTemplate = Handlebars.compile($('#featureTemplate').html())
    var categoryTemplate = Handlebars.compile($('#categoryTemplate').html())
    var layoutTemplate = Handlebars.compile($('#layoutTemplate').html())

    function filterThemes (themes) {
      // Sort the themes
      var themeList = _.sortBy(themes, function (theme) { return theme.date }).reverse()

      // Get the filter values
      var selectedFeatures = []
      var selectedCategories = []
      var selectedLayouts = []
      var selectedTags = _.pluck($('.chips-autocomplete').material_chip('data'), 'tag')
      $('#features :checkbox:checked').each(function (key, checkbox) {
        selectedFeatures.push($(checkbox).attr('data-name'))
      })
      $('#categories :checkbox:checked').each(function (key, checkbox) {
        selectedCategories.push($(checkbox).attr('data-name'))
      })
      $('#layouts :checkbox:checked').each(function (key, checkbox) {
        selectedLayouts.push($(checkbox).attr('data-name'))
      })

      // Filter the themes
      themeList = _.filter(themeList, function (theme) {
        return _.every(selectedFeatures, function (feature) { return _.contains(theme.features, feature) })
      })
      themeList = _.filter(themeList, function (theme) {
        return _.every(selectedCategories, function (category) { return _.contains(theme.categories, category) })
      })
      themeList = _.filter(themeList, function (theme) {
        return _.every(selectedLayouts, function (layout) { return _.contains(theme.layouts, layout) })
      })
      themeList = _.filter(themeList, function (theme) {
        return _.every(selectedTags, function (tag) { return _.contains(theme.tags, tag) })
      })
      themeList = _.filter(themeList, function (theme) {
        return s.include(String(theme.title).toLowerCase(), $('#searchBox').val().toLowerCase())
      })

      // Return the theme list
      return themeList
    }

    // Sort the themes
    function sortThemes (themes, orderBy) {
      var themeList = themes

      switch (orderBy) {
        case 'featured':
          themeList = _.sortBy(themeList.reverse(), 'featured').reverse()
          break
        case 'name':
          themeList = _.sortBy(themeList, 'title')
          break
        case 'newest':
          themeList = _.sortBy(themeList, 'date').reverse()
          break
        case 'oldest':
          themeList = _.sortBy(themeList, 'date')
          break
      }
      return themeList
    }

    // Render a theme
    function renderTheme (theme) {
      return themeTemplate(theme)
    }

    // Append themes to the view
    function appendThemes (themes, min, max) {
      var el = $('<div>')

      themes.slice(min, max).forEach(function (theme) {
        $(el).append(renderTheme(theme))
      })

      $('#themeView').append($(el).html())

      if (themes.length > max) {
        $('.load-more').show()
      } else {
        $('.load-more').hide()
      }
      if (imgLoaded){
        lazy.update()
      }
    }

    // Update a theme in the view (also updates masterThemeList)
    function updateTheme (theme) {
      $.ajax({
        url: 'https://themejekyll-chromatical.rhcloud.com/update',
        data: JSON.stringify({url: theme}),
        method: 'POST',
        contentType: 'application/json',
        success: function (data) {
          var index = _.findIndex(masterThemeList, {url: theme})
          if (index !== -1) {
            masterThemeList[index] = data
            if ($('#' + theme + '-theme').length > 0){
              $('#' + theme + '-theme').html($(renderTheme(masterThemeList[index])).html())
              lazy.update()
            }
          }
        }
      })
    }

    // Clear the view of themes
    function clearThemeView () {
      $(document).scrollTop(0)
      $('#themeView').empty()
    }

    // Clear all set filters
    function clearFilters () {
      $('#searchBox').val('')
      $('.chips-autocomplete .chip .close').click()
      $('#filters').find(':checkbox:checked').prop('checked', false)
      filterChange()
    }

    // Add a filter to the list
    function appendFilter (type, context) {
      switch (type) {
        case 'feature':
          $('#features').append(featureTemplate(context))
          break
        case 'category':
          $('#categories').append(categoryTemplate(context))
          break
        case 'layout':
          $('#layouts').append(layoutTemplate(context))
          break
      }
    }

    // Update filters, disabling and enabling
    function updateFilters (filters) {
      $('#features :checkbox').each(function (key, checkbox) {
        if (!_.contains(filters.features, $(checkbox).attr('data-name'))) {
          $(checkbox).attr('disabled', true)
        } else {
          $(checkbox).removeAttr('disabled')
        }
      })

      $('#categories :checkbox').each(function (key, checkbox) {
        if (!_.contains(filters.categories, $(checkbox).attr('data-name'))) {
          $(checkbox).attr('disabled', true)
        } else {
          $(checkbox).removeAttr('disabled')
        }
      })

      $('#layouts :checkbox').each(function (key, checkbox) {
        if (!_.contains(filters.layouts, $(checkbox).attr('data-name'))) {
          $(checkbox).attr('disabled', true)
        } else {
          $(checkbox).removeAttr('disabled')
        }
      })
    }

    // Function to update everything when a filter is changed
    var filterChange = function () {
      var themeList = sortThemes(filterThemes(masterThemeList), $('#sortSelect').val())

      // Clear the theme view
      clearThemeView()

      // Add themes to the theme view
      if (themeList.length > 0) {
        $('#noThemesFound').hide()
        appendThemes(themeList, 0, 30)
      } else {
        $('#noThemesFound').show()
      }

      // Enable or disable filters
      updateFilters({
        features: _.uniq(_.flatten(_.pluck(themeList, 'features'))),
        categories: _.uniq(_.flatten(_.pluck(themeList, 'categories'))),
        layouts: _.uniq(_.flatten(_.pluck(themeList, 'layouts')))
      })
    }

    // Function to load AJAX theme page
    function ajaxLoadPage (theme) {
      // Remember scroll location
      scrollLocation = $(document).scrollTop()

      // Cache the loading theme
      var loadingTheme = _.where(masterThemeList, {url: theme})[0]

      // Change some classes to alter the layout
      $('body').removeClass('home').addClass('show-theme')

      // Load the HTML from a Handlebars template
      $('#theme-wrapper').empty().html(themePageTemplate(loadingTheme))

      // Update page title
      $('title').text(loadingTheme.title + ' | ThemeJekyll - Jekyll Themes Gallery')

      // Show the AJAX page
      $('#theme-wrapper').show()

      // Make sure the page is scrolled to top
      $(document).scrollTop(0)

      // Initialize Swiper slider
      swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        loop: true
      })
    }

    // Function to hide and destroy AJAX theme page
    function unloadAjaxPage () {
      // Change some classes to alter the layout
      $('body').removeClass('show-theme').addClass('home')

      // Hide the AJAX page
      $('#theme-wrapper').fadeOut(function () {
        // Destroy the Swiper slider
        swiper.destroy()

        // Empty the AJAX page
        $('#theme-wrapper').empty()

        // Update page title
        $('title').text('ThemeJekyll - Jekyll Themes Gallery')
      })
      // Go back to the old scroll location
      $(document).scrollTop(scrollLocation)
    }

    // Event handlers for filter changes
    $('#filters-clear').on('click', function () {
      clearFilters()
    })

    $(document).on('change', '.filter', function () {
      filterChange()
    })

    $('#searchBox').on('input', function () {
      filterChange()
    })

    $('#sortSelect').on('change', function () {
      filterChange()
    })

    // Show more button
    $('#showMore').on('click', function () {
      var loadedThemes = $('.theme').length
      appendThemes(sortThemes(filterThemes(masterThemeList)), loadedThemes, loadedThemes + 30)
    })

    // Event handler for Back To Themes button
    $(document).on('click', '#back-to-themes', function (e) {
      e.preventDefault()
      history.back()
    })

    // Event handler for clicking on a theme
    $(document).on('click', '.theme-url', function (e) {
      e.preventDefault()
      history.pushState($(this).attr('href'), '', $(this).attr('href'))
      ajaxLoadPage($(this).attr('data-theme'))
    })

    // Event handler for handling browser back and forward
    $(window).on('popstate', function (e) {
      if (e.target.location.href === window.location.origin + '/themes/') {
        unloadAjaxPage()
      } else {
        if (_.last(e.target.window.location.href) !== '#' && e.target.window.location.hash[0] !== '#') {
          ajaxLoadPage(_.last(e.target.location.href.split('/'), 2)[1])
        }
      }
    })

    // Create initial filters
    _.uniq(_.flatten(_.pluck(masterThemeList, 'features'))).sort().forEach(function (item) {
      appendFilter('feature', {idslug: s.slugify(item), name: item})
    })
    _.uniq(_.flatten(_.pluck(masterThemeList, 'categories'))).sort().forEach(function (item) {
      appendFilter('category', {idslug: s.slugify(item), name: item})
    })
    _.uniq(_.flatten(_.pluck(masterThemeList, 'layouts'))).sort().forEach(function (item) {
      appendFilter('layout', {idslug: s.slugify(item), name: item})
    })

    // Initialize the Materialize tags field
    var tags = _.uniq(_.flatten(_.pluck(masterThemeList, 'tags')))
    $('.chips-autocomplete').material_chip({
      autocompleteOptions: {
        data: _.object(tags, []),
        limit: Infinity,
        minLength: 1
      },
      secondaryPlaceholder: '+tag'
    })

    // Event handlers for tag changes
    $('.chips-autocomplete').on('chip.add', function (e, chip) {
      // Remove the added chip if it is not a known tag
      if (!_.contains(tags, chip.tag)) {
        // Needs to simulate click because Materialize does not expose functions to delete tags
        $('.chips-autocomplete .chip .close').last().click()
      } else {
        filterChange()
      }
    })

    $('.chips-autocomplete').on('chip.delete', function (e, chip) {
      filterChange()
    })

    // Add initial themes to theme view
    filterChange()

    // Lazy load initial images
    $('#themeView').imagesLoaded(function () {
      imgLoaded = true
      lazy.update()
    })
  }).fail(function() {
    $('#loader').fadeOut(function(){
      $('#loadFailed').show()
    })
  })
})
