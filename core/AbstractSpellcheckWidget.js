// $Id$

/**
 * Implements Solr spellcheck.
 * @see http://wiki.apache.org/solr/SpellCheckComponent
 *
 * @class AbstractSpellcheckWidget
 * @augments AjaxSolr.AbstractWidget
 */
AjaxSolr.AbstractSpellcheckWidget = AjaxSolr.AbstractWidget.extend(
  /** @lends AjaxSolr.AbstractWidget.prototype */
  {
  /**
   * The spellcheck parameter.
   *
   * @field
   * @public
   * @type Boolean
   * @default false
   */
  spellcheck: false,

  /**
   * The spellcheck.count parameter.
   *
   * @field
   * @public
   * @type Number
   * @default 1
   */
  count: 1,

  /**
   * The spellcheck.onlyMorePopular parameter.
   *
   * @field
   * @public
   * @type Boolean
   * @default true
   */
  onlyMorePopular: true,

  /**
   * The spellcheck.extendedResults parameter.
   *
   * @field
   * @public
   * @type Boolean
   * @default false
   */
  extendedResults: false,

  /**
   * The spellcheck.collate parameter.
   *
   * @field
   * @public
   * @type Boolean
   * @default false
   */
  collate: false,

  /**
   * The spellcheck.q parameter.
   *
   * @field
   * @private
   * @type String
   */
  q: null,

  /**
   * The collation.
   *
   * @field
   * @private
   * @type String
   * @default ""
   */
  collation: '',

  /**
   * The suggestions.
   *
   * @field
   * @private
   */
  suggestions: {},

  /**
   * The original query.
   *
   * @field
   * @private
   * @type String
   * @default ""
   */
  query: '',

  buildQuery: function (queryObj) {
    if (this.spellcheck) {
      queryObj.params.spellcheck = 'true';
      queryObj.params['spellcheck.count'] = this.count;
      queryObj.params['spellcheck.onlyMorePopular'] = this.onlyMorePopular.toString();
      queryObj.params['spellcheck.extendedResults'] = this.extendedResults.toString();
      queryObj.params['spellcheck.collate'] = this.collate.toString();
    }
  },

  alterQuery: function (queryObj) {
    if (this.spellcheck && queryObj.q) {
      queryObj.params['spellcheck.q'] = queryObj.q;
    }
  },

  handleResult: function (data) {
    this.collation = '';
    this.suggestions = {};
    this.query = data.responseHeader.params.q;

    if (data.spellcheck && data.spellcheck.suggestions) {
      var suggestions = data.spellcheck.suggestions;

      if (suggestions.collation) {
        this.collation = suggestions.collation;
      }

      for (var word in suggestions) {
        if (word == 'collation' || word == 'correctlySpelled') continue;

        this.suggestions[word] = [];
        for (var i = 0, length = suggestions[word].suggestion.length; i < length; i++) {
          if (this.extendedResults) {
            this.suggestions[word].push(suggestions[word].suggestion[i].word);
          }
          else {
            this.suggestions[word].push(suggestions[word].suggestion[i]);
          }
        }
      }

      if (AjaxSolr.size(this.suggestions)) {
        this.handleSuggestions(data);
      }
    }
  },

  /**
   * An abstract hook for child implementations.
   * Allow the child to handle the suggestions without parsing the response.
   */
  handleSuggestions: function (data) {},

  /**
   * Uses the top suggestion for each word to return a suggested query.
   *
   * @returns {String} A suggested query.
   */
  suggestion: function () {
    var replacePairs = {};

    for (var word in this.suggestions) {
      replacePairs[word] = this.suggestions[word][0];
    }

    return this.query.strtr(replacePairs);
  }
});
