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
   * @default true
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

  alterQuery: function (queryObj) {
    if (this.spellcheck) {
      queryObj.params.spellcheck = 'true';
      queryObj.params['spellcheck.count'] = this.count;
      queryObj.params['spellcheck.onlyMorePopular'] = this.onlyMorePopular.toString();
      queryObj.params['spellcheck.extendedResults'] = this.extendedResults.toString();
      queryObj.params['spellcheck.collate'] = this.collate.toString();
    }
  }

  handleResult: function (data) {
    if (data.spellcheck) {
      for (var word in data.spellcheck.suggestions) {
        if (this.extendedResults) {
          
        }
      }
    }
  }

  // data.spellcheck.suggestions.collation

  // simple
  // data.spellcheck.suggestions.[].numFound
  // data.spellcheck.suggestions.[].suggestion[]

  // extended
  // data.spellcheck.suggestions.[].numFound
  // data.spellcheck.suggestions.[].suggestion[].word
  // data.spellcheck.suggestions.[].suggestion[].freq
});
