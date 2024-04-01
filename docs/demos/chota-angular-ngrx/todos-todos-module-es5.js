function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["todos-todos-module"], {
  /***/
  "./node_modules/@ngrx/entity/__ivy_ngcc__/fesm2015/entity.js":
  /*!*******************************************************************!*\
    !*** ./node_modules/@ngrx/entity/__ivy_ngcc__/fesm2015/entity.js ***!
    \*******************************************************************/

  /*! exports provided: Dictionary, createEntityAdapter */

  /***/
  function node_modulesNgrxEntity__ivy_ngcc__Fesm2015EntityJs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "Dictionary", function () {
      return Dictionary;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "createEntityAdapter", function () {
      return createEntityAdapter;
    });
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /**
     * @license NgRx 9.2.0
     * (c) 2015-2018 Brandon Roberts, Mike Ryan, Rob Wormald, Victor Savkin
     * License: MIT
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: modules/entity/src/entity_state.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @template V
     * @return {?}
     */


    function getInitialEntityState() {
      return {
        ids: [],
        entities: {}
      };
    }
    /**
     * @template V
     * @return {?}
     */


    function createInitialStateFactory() {
      /**
       * @param {?=} additionalState
       * @return {?}
       */
      function getInitialState() {
        var additionalState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return Object.assign(getInitialEntityState(), additionalState);
      }

      return {
        getInitialState: getInitialState
      };
    }
    /**
     * @fileoverview added by tsickle
     * Generated from: modules/entity/src/state_selectors.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @template T
     * @return {?}
     */


    function createSelectorsFactory() {
      /**
       * @param {?=} selectState
       * @return {?}
       */
      function getSelectors(selectState) {
        /** @type {?} */
        var selectIds =
        /**
        * @param {?} state
        * @return {?}
        */
        function selectIds(state) {
          return state.ids;
        };
        /** @type {?} */


        var selectEntities =
        /**
        * @param {?} state
        * @return {?}
        */
        function selectEntities(state) {
          return state.entities;
        };
        /** @type {?} */


        var selectAll = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectIds, selectEntities,
        /**
        * @param {?} ids
        * @param {?} entities
        * @return {?}
        */
        function (ids, entities) {
          return ids.map(
          /**
          * @param {?} id
          * @return {?}
          */
          function (id) {
            return (
              /** @type {?} */
              entities[id]
            );
          });
        });
        /** @type {?} */

        var selectTotal = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectIds,
        /**
        * @param {?} ids
        * @return {?}
        */
        function (ids) {
          return ids.length;
        });

        if (!selectState) {
          return {
            selectIds: selectIds,
            selectEntities: selectEntities,
            selectAll: selectAll,
            selectTotal: selectTotal
          };
        }

        return {
          selectIds: Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, selectIds),
          selectEntities: Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, selectEntities),
          selectAll: Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, selectAll),
          selectTotal: Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, selectTotal)
        };
      }

      return {
        getSelectors: getSelectors
      };
    }
    /**
     * @fileoverview added by tsickle
     * Generated from: modules/entity/src/state_adapter.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /** @enum {number} */


    var DidMutate = {
      EntitiesOnly: 0,
      Both: 1,
      None: 2
    };
    DidMutate[DidMutate.EntitiesOnly] = 'EntitiesOnly';
    DidMutate[DidMutate.Both] = 'Both';
    DidMutate[DidMutate.None] = 'None';
    /**
     * @template V, R
     * @param {?} mutator
     * @return {?}
     */

    function createStateOperator(mutator) {
      return (
        /**
        * @template S
        * @param {?} arg
        * @param {?} state
        * @return {?}
        */
        function operation(arg, state) {
          /** @type {?} */
          var clonedEntityState = {
            ids: _toConsumableArray(state.ids),
            entities: Object.assign({}, state.entities)
          };
          /** @type {?} */

          var didMutate = mutator(arg, clonedEntityState);

          if (didMutate === DidMutate.Both) {
            return Object.assign({}, state, clonedEntityState);
          }

          if (didMutate === DidMutate.EntitiesOnly) {
            return Object.assign(Object.assign({}, state), {
              entities: clonedEntityState.entities
            });
          }

          return state;
        }
      );
    }
    /**
     * @fileoverview added by tsickle
     * Generated from: modules/entity/src/utils.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @template T
     * @param {?} entity
     * @param {?} selectId
     * @return {?}
     */


    function selectIdValue(entity, selectId) {
      /** @type {?} */
      var key = selectId(entity);

      if (Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["isDevMode"])() && key === undefined) {
        console.warn('@ngrx/entity: The entity passed to the `selectId` implementation returned undefined.', 'You should probably provide your own `selectId` implementation.', 'The entity that was passed:', entity, 'The `selectId` implementation:', selectId.toString());
      }

      return key;
    }
    /**
     * @fileoverview added by tsickle
     * Generated from: modules/entity/src/unsorted_state_adapter.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @template T
     * @param {?} selectId
     * @return {?}
     */


    function createUnsortedStateAdapter(selectId) {
      /**
       * @param {?} entity
       * @param {?} state
       * @return {?}
       */
      function addOneMutably(entity, state) {
        /** @type {?} */
        var key = selectIdValue(entity, selectId);

        if (key in state.entities) {
          return DidMutate.None;
        }

        state.ids.push(key);
        state.entities[key] = entity;
        return DidMutate.Both;
      }
      /**
       * @param {?} entities
       * @param {?} state
       * @return {?}
       */


      function addManyMutably(entities, state) {
        /** @type {?} */
        var didMutate = false;

        var _iterator = _createForOfIteratorHelper(entities),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entity = _step.value;
            didMutate = addOneMutably(entity, state) !== DidMutate.None || didMutate;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return didMutate ? DidMutate.Both : DidMutate.None;
      }
      /**
       * @param {?} entities
       * @param {?} state
       * @return {?}
       */


      function setAllMutably(entities, state) {
        state.ids = [];
        state.entities = {};
        addManyMutably(entities, state);
        return DidMutate.Both;
      }
      /**
       * @param {?} entity
       * @param {?} state
       * @return {?}
       */


      function setOneMutably(entity, state) {
        /** @type {?} */
        var key = selectIdValue(entity, selectId);

        if (key in state.entities) {
          state.entities[key] = entity;
          return DidMutate.EntitiesOnly;
        }

        state.ids.push(key);
        state.entities[key] = entity;
        return DidMutate.Both;
      }
      /**
       * @param {?} key
       * @param {?} state
       * @return {?}
       */


      function removeOneMutably(key, state) {
        return removeManyMutably([key], state);
      }
      /**
       * @param {?} keysOrPredicate
       * @param {?} state
       * @return {?}
       */


      function removeManyMutably(keysOrPredicate, state) {
        /** @type {?} */
        var keys = keysOrPredicate instanceof Array ? keysOrPredicate : state.ids.filter(
        /**
        * @param {?} key
        * @return {?}
        */
        function (key) {
          return keysOrPredicate(state.entities[key]);
        });
        /** @type {?} */

        var didMutate = keys.filter(
        /**
        * @param {?} key
        * @return {?}
        */
        function (key) {
          return key in state.entities;
        }).map(
        /**
        * @param {?} key
        * @return {?}
        */
        function (key) {
          return delete state.entities[key];
        }).length > 0;

        if (didMutate) {
          state.ids = state.ids.filter(
          /**
          * @param {?} id
          * @return {?}
          */
          function (id) {
            return id in state.entities;
          });
        }

        return didMutate ? DidMutate.Both : DidMutate.None;
      }
      /**
       * @template S
       * @param {?} state
       * @return {?}
       */


      function removeAll(state) {
        return Object.assign({}, state, {
          ids: [],
          entities: {}
        });
      }
      /**
       * @param {?} keys
       * @param {?} update
       * @param {?} state
       * @return {?}
       */


      function takeNewKey(keys, update, state) {
        /** @type {?} */
        var original = state.entities[update.id];
        /** @type {?} */

        var updated = Object.assign({}, original, update.changes);
        /** @type {?} */

        var newKey = selectIdValue(updated, selectId);
        /** @type {?} */

        var hasNewKey = newKey !== update.id;

        if (hasNewKey) {
          keys[update.id] = newKey;
          delete state.entities[update.id];
        }

        state.entities[newKey] = updated;
        return hasNewKey;
      }
      /**
       * @param {?} update
       * @param {?} state
       * @return {?}
       */


      function updateOneMutably(update, state) {
        return updateManyMutably([update], state);
      }
      /**
       * @param {?} updates
       * @param {?} state
       * @return {?}
       */


      function updateManyMutably(updates, state) {
        /** @type {?} */
        var newKeys = {};
        updates = updates.filter(
        /**
        * @param {?} update
        * @return {?}
        */
        function (update) {
          return update.id in state.entities;
        });
        /** @type {?} */

        var didMutateEntities = updates.length > 0;

        if (didMutateEntities) {
          /** @type {?} */
          var didMutateIds = updates.filter(
          /**
          * @param {?} update
          * @return {?}
          */
          function (update) {
            return takeNewKey(newKeys, update, state);
          }).length > 0;

          if (didMutateIds) {
            state.ids = state.ids.map(
            /**
            * @param {?} id
            * @return {?}
            */
            function (id) {
              return newKeys[id] || id;
            });
            return DidMutate.Both;
          } else {
            return DidMutate.EntitiesOnly;
          }
        }

        return DidMutate.None;
      }
      /**
       * @param {?} map
       * @param {?} state
       * @return {?}
       */


      function mapMutably(map, state) {
        /** @type {?} */
        var changes = state.ids.reduce(
        /**
        * @param {?} changes
        * @param {?} id
        * @return {?}
        */
        function (changes, id) {
          /** @type {?} */
          var change = map(state.entities[id]);

          if (change !== state.entities[id]) {
            changes.push({
              id: id,
              changes: change
            });
          }

          return changes;
        }, []);
        /** @type {?} */

        var updates = changes.filter(
        /**
        * @param {?} __0
        * @return {?}
        */
        function (_ref) {
          var id = _ref.id;
          return id in state.entities;
        });
        return updateManyMutably(updates, state);
      }
      /**
       * @param {?} entity
       * @param {?} state
       * @return {?}
       */


      function upsertOneMutably(entity, state) {
        return upsertManyMutably([entity], state);
      }
      /**
       * @param {?} entities
       * @param {?} state
       * @return {?}
       */


      function upsertManyMutably(entities, state) {
        /** @type {?} */
        var added = [];
        /** @type {?} */

        var updated = [];

        var _iterator2 = _createForOfIteratorHelper(entities),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var entity = _step2.value;

            /** @type {?} */
            var id = selectIdValue(entity, selectId);

            if (id in state.entities) {
              updated.push({
                id: id,
                changes: entity
              });
            } else {
              added.push(entity);
            }
          }
          /** @type {?} */

        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var didMutateByUpdated = updateManyMutably(updated, state);
        /** @type {?} */

        var didMutateByAdded = addManyMutably(added, state);

        switch (true) {
          case didMutateByAdded === DidMutate.None && didMutateByUpdated === DidMutate.None:
            return DidMutate.None;

          case didMutateByAdded === DidMutate.Both || didMutateByUpdated === DidMutate.Both:
            return DidMutate.Both;

          default:
            return DidMutate.EntitiesOnly;
        }
      }

      return {
        removeAll: removeAll,
        addOne: createStateOperator(addOneMutably),
        addMany: createStateOperator(addManyMutably),
        addAll: createStateOperator(setAllMutably),
        setAll: createStateOperator(setAllMutably),
        setOne: createStateOperator(setOneMutably),
        updateOne: createStateOperator(updateOneMutably),
        updateMany: createStateOperator(updateManyMutably),
        upsertOne: createStateOperator(upsertOneMutably),
        upsertMany: createStateOperator(upsertManyMutably),
        removeOne: createStateOperator(removeOneMutably),
        removeMany: createStateOperator(removeManyMutably),
        map: createStateOperator(mapMutably)
      };
    }
    /**
     * @fileoverview added by tsickle
     * Generated from: modules/entity/src/sorted_state_adapter.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @template T
     * @param {?} selectId
     * @param {?} sort
     * @return {?}
     */


    function createSortedStateAdapter(selectId, sort) {
      var _createUnsortedStateA = createUnsortedStateAdapter(selectId),
          removeOne = _createUnsortedStateA.removeOne,
          removeMany = _createUnsortedStateA.removeMany,
          removeAll = _createUnsortedStateA.removeAll;
      /**
       * @param {?} entity
       * @param {?} state
       * @return {?}
       */


      function addOneMutably(entity, state) {
        return addManyMutably([entity], state);
      }
      /**
       * @param {?} newModels
       * @param {?} state
       * @return {?}
       */


      function addManyMutably(newModels, state) {
        /** @type {?} */
        var models = newModels.filter(
        /**
        * @param {?} model
        * @return {?}
        */
        function (model) {
          return !(selectIdValue(model, selectId) in state.entities);
        });

        if (models.length === 0) {
          return DidMutate.None;
        } else {
          merge(models, state);
          return DidMutate.Both;
        }
      }
      /**
       * @param {?} models
       * @param {?} state
       * @return {?}
       */


      function setAllMutably(models, state) {
        state.entities = {};
        state.ids = [];
        addManyMutably(models, state);
        return DidMutate.Both;
      }
      /**
       * @param {?} entity
       * @param {?} state
       * @return {?}
       */


      function setOneMutably(entity, state) {
        /** @type {?} */
        var id = selectIdValue(entity, selectId);

        if (id in state.entities) {
          state.ids = state.ids.filter(
          /**
          * @param {?} val
          * @return {?}
          */
          function (val) {
            return val !== id;
          });
          merge([entity], state);
          return DidMutate.Both;
        } else {
          return addOneMutably(entity, state);
        }
      }
      /**
       * @param {?} update
       * @param {?} state
       * @return {?}
       */


      function updateOneMutably(update, state) {
        return updateManyMutably([update], state);
      }
      /**
       * @param {?} models
       * @param {?} update
       * @param {?} state
       * @return {?}
       */


      function takeUpdatedModel(models, update, state) {
        if (!(update.id in state.entities)) {
          return false;
        }
        /** @type {?} */


        var original = state.entities[update.id];
        /** @type {?} */

        var updated = Object.assign({}, original, update.changes);
        /** @type {?} */

        var newKey = selectIdValue(updated, selectId);
        delete state.entities[update.id];
        models.push(updated);
        return newKey !== update.id;
      }
      /**
       * @param {?} updates
       * @param {?} state
       * @return {?}
       */


      function updateManyMutably(updates, state) {
        /** @type {?} */
        var models = [];
        /** @type {?} */

        var didMutateIds = updates.filter(
        /**
        * @param {?} update
        * @return {?}
        */
        function (update) {
          return takeUpdatedModel(models, update, state);
        }).length > 0;

        if (models.length === 0) {
          return DidMutate.None;
        } else {
          /** @type {?} */
          var originalIds = state.ids;
          /** @type {?} */

          var updatedIndexes = [];
          state.ids = state.ids.filter(
          /**
          * @param {?} id
          * @param {?} index
          * @return {?}
          */
          function (id, index) {
            if (id in state.entities) {
              return true;
            } else {
              updatedIndexes.push(index);
              return false;
            }
          });
          merge(models, state);

          if (!didMutateIds && updatedIndexes.every(
          /**
          * @param {?} i
          * @return {?}
          */
          function (i) {
            return state.ids[i] === originalIds[i];
          })) {
            return DidMutate.EntitiesOnly;
          } else {
            return DidMutate.Both;
          }
        }
      }
      /**
       * @param {?} updatesOrMap
       * @param {?} state
       * @return {?}
       */


      function mapMutably(updatesOrMap, state) {
        /** @type {?} */
        var updates = state.ids.reduce(
        /**
        * @param {?} changes
        * @param {?} id
        * @return {?}
        */
        function (changes, id) {
          /** @type {?} */
          var change = updatesOrMap(state.entities[id]);

          if (change !== state.entities[id]) {
            changes.push({
              id: id,
              changes: change
            });
          }

          return changes;
        }, []);
        return updateManyMutably(updates, state);
      }
      /**
       * @param {?} entity
       * @param {?} state
       * @return {?}
       */


      function upsertOneMutably(entity, state) {
        return upsertManyMutably([entity], state);
      }
      /**
       * @param {?} entities
       * @param {?} state
       * @return {?}
       */


      function upsertManyMutably(entities, state) {
        /** @type {?} */
        var added = [];
        /** @type {?} */

        var updated = [];

        var _iterator3 = _createForOfIteratorHelper(entities),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var entity = _step3.value;

            /** @type {?} */
            var id = selectIdValue(entity, selectId);

            if (id in state.entities) {
              updated.push({
                id: id,
                changes: entity
              });
            } else {
              added.push(entity);
            }
          }
          /** @type {?} */

        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        var didMutateByUpdated = updateManyMutably(updated, state);
        /** @type {?} */

        var didMutateByAdded = addManyMutably(added, state);

        switch (true) {
          case didMutateByAdded === DidMutate.None && didMutateByUpdated === DidMutate.None:
            return DidMutate.None;

          case didMutateByAdded === DidMutate.Both || didMutateByUpdated === DidMutate.Both:
            return DidMutate.Both;

          default:
            return DidMutate.EntitiesOnly;
        }
      }
      /**
       * @param {?} models
       * @param {?} state
       * @return {?}
       */


      function merge(models, state) {
        models.sort(sort);
        /** @type {?} */

        var ids = [];
        /** @type {?} */

        var i = 0;
        /** @type {?} */

        var j = 0;

        while (i < models.length && j < state.ids.length) {
          /** @type {?} */
          var model = models[i];
          /** @type {?} */

          var modelId = selectIdValue(model, selectId);
          /** @type {?} */

          var entityId = state.ids[j];
          /** @type {?} */

          var entity = state.entities[entityId];

          if (sort(model, entity) <= 0) {
            ids.push(modelId);
            i++;
          } else {
            ids.push(entityId);
            j++;
          }
        }

        if (i < models.length) {
          state.ids = ids.concat(models.slice(i).map(selectId));
        } else {
          state.ids = ids.concat(state.ids.slice(j));
        }

        models.forEach(
        /**
        * @param {?} model
        * @param {?} i
        * @return {?}
        */
        function (model, i) {
          state.entities[selectId(model)] = model;
        });
      }

      return {
        removeOne: removeOne,
        removeMany: removeMany,
        removeAll: removeAll,
        addOne: createStateOperator(addOneMutably),
        updateOne: createStateOperator(updateOneMutably),
        upsertOne: createStateOperator(upsertOneMutably),
        addAll: createStateOperator(setAllMutably),
        setAll: createStateOperator(setAllMutably),
        setOne: createStateOperator(setOneMutably),
        addMany: createStateOperator(addManyMutably),
        updateMany: createStateOperator(updateManyMutably),
        upsertMany: createStateOperator(upsertManyMutably),
        map: createStateOperator(mapMutably)
      };
    }
    /**
     * @fileoverview added by tsickle
     * Generated from: modules/entity/src/create_adapter.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @template T
     * @param {?=} options
     * @return {?}
     */


    function createEntityAdapter() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _Object$assign = Object.assign({
        sortComparer: false,
        selectId:
        /**
        * @param {?} instance
        * @return {?}
        */
        function selectId(instance) {
          return instance.id;
        }
      }, options),
          selectId = _Object$assign.selectId,
          sortComparer = _Object$assign.sortComparer;
      /** @type {?} */


      var stateFactory = createInitialStateFactory();
      /** @type {?} */

      var selectorsFactory = createSelectorsFactory();
      /** @type {?} */

      var stateAdapter = sortComparer ? createSortedStateAdapter(selectId, sortComparer) : createUnsortedStateAdapter(selectId);
      return Object.assign(Object.assign(Object.assign({
        selectId: selectId,
        sortComparer: sortComparer
      }, stateFactory), selectorsFactory), stateAdapter);
    }
    /**
     * @fileoverview added by tsickle
     * Generated from: modules/entity/src/models.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @record
     * @template T
     */


    function DictionaryNum() {}
    /**
     * @abstract
     * @template T
     */


    var Dictionary = function Dictionary() {
      _classCallCheck(this, Dictionary);
    };
    /**
     * @record
     * @template T
     */


    function UpdateStr() {}

    if (false) {}
    /**
     * @record
     * @template T
     */


    function UpdateNum() {}

    if (false) {}
    /**
     * @record
     * @template T
     */


    function EntityState() {}

    if (false) {}
    /**
     * @record
     * @template T
     */


    function EntityDefinition() {}

    if (false) {}
    /**
     * @record
     * @template T
     */


    function EntityStateAdapter() {}

    if (false) {}
    /**
     * @record
     * @template T, V
     */


    function EntitySelectors() {}

    if (false) {}
    /**
     * @record
     * @template T
     */


    function EntityAdapter() {}

    if (false) {}
    /**
     * @fileoverview added by tsickle
     * Generated from: modules/entity/src/index.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: modules/entity/public_api.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: modules/entity/index.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * Generated bundle index. Do not edit.
     */
    //# sourceMappingURL=entity.js.map

    /***/

  },

  /***/
  "./src/app/todos/actions/index.ts":
  /*!****************************************!*\
    !*** ./src/app/todos/actions/index.ts ***!
    \****************************************/

  /*! exports provided: addTodo, updateTodo, deleteTodo, loadTodos, loadTodosRequest, loadTodosSuccess, loadTodosFail, addTodoRequest, addTodoSuccess, addTodoFail, updateTodoRequest, updateTodoSuccess, updateTodoFail, deleteTodoRequest, deleteTodoSuccess, deleteTodoFail */

  /***/
  function srcAppTodosActionsIndexTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var _todos_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./todos.actions */
    "./src/app/todos/actions/todos.actions.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "addTodo", function () {
      return _todos_actions__WEBPACK_IMPORTED_MODULE_0__["addTodo"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "updateTodo", function () {
      return _todos_actions__WEBPACK_IMPORTED_MODULE_0__["updateTodo"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "deleteTodo", function () {
      return _todos_actions__WEBPACK_IMPORTED_MODULE_0__["deleteTodo"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "loadTodos", function () {
      return _todos_actions__WEBPACK_IMPORTED_MODULE_0__["loadTodos"];
    });
    /* harmony import */


    var _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./todos-ui.actions */
    "./src/app/todos/actions/todos-ui.actions.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "loadTodosRequest", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosRequest"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "loadTodosSuccess", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosSuccess"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "loadTodosFail", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosFail"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "addTodoRequest", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["addTodoRequest"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "addTodoSuccess", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["addTodoSuccess"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "addTodoFail", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["addTodoFail"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "updateTodoRequest", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodoRequest"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "updateTodoSuccess", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodoSuccess"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "updateTodoFail", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodoFail"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "deleteTodoRequest", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoRequest"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "deleteTodoSuccess", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoSuccess"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "deleteTodoFail", function () {
      return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoFail"];
    });
    /***/

  },

  /***/
  "./src/app/todos/actions/todos-ui.actions.ts":
  /*!***************************************************!*\
    !*** ./src/app/todos/actions/todos-ui.actions.ts ***!
    \***************************************************/

  /*! exports provided: loadTodosRequest, loadTodosSuccess, loadTodosFail, addTodoRequest, addTodoSuccess, addTodoFail, updateTodoRequest, updateTodoSuccess, updateTodoFail, deleteTodoRequest, deleteTodoSuccess, deleteTodoFail */

  /***/
  function srcAppTodosActionsTodosUiActionsTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "loadTodosRequest", function () {
      return loadTodosRequest;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "loadTodosSuccess", function () {
      return loadTodosSuccess;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "loadTodosFail", function () {
      return loadTodosFail;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "addTodoRequest", function () {
      return addTodoRequest;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "addTodoSuccess", function () {
      return addTodoSuccess;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "addTodoFail", function () {
      return addTodoFail;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "updateTodoRequest", function () {
      return updateTodoRequest;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "updateTodoSuccess", function () {
      return updateTodoSuccess;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "updateTodoFail", function () {
      return updateTodoFail;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "deleteTodoRequest", function () {
      return deleteTodoRequest;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "deleteTodoSuccess", function () {
      return deleteTodoSuccess;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "deleteTodoFail", function () {
      return deleteTodoFail;
    });
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");

    var loadTodosRequest = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] LoadTodosRequest');
    var loadTodosSuccess = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] LoadTodosSuccess');
    var loadTodosFail = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] LoadTodosFail', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
    var addTodoRequest = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] AddTodoRequest', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
    var addTodoSuccess = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] AddTodoSuccess');
    var addTodoFail = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] AddTodoFail', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
    var updateTodoRequest = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] UpdateTodoRequest', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
    var updateTodoSuccess = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] updateTodoSuccess');
    var updateTodoFail = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] UpdateTodoFail', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
    var deleteTodoRequest = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] DeleteTodoRequest', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
    var deleteTodoSuccess = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] DeleteTodoSuccess');
    var deleteTodoFail = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] DeleteTodoFail', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
    /***/
  },

  /***/
  "./src/app/todos/actions/todos.actions.ts":
  /*!************************************************!*\
    !*** ./src/app/todos/actions/todos.actions.ts ***!
    \************************************************/

  /*! exports provided: addTodo, updateTodo, deleteTodo, loadTodos */

  /***/
  function srcAppTodosActionsTodosActionsTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "addTodo", function () {
      return addTodo;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "updateTodo", function () {
      return updateTodo;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "deleteTodo", function () {
      return deleteTodo;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "loadTodos", function () {
      return loadTodos;
    });
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");

    var addTodo = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] AddTodo', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
    var updateTodo = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] UpdateTodo', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
    var deleteTodo = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] DeleteTodo', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
    var loadTodos = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] LoadTodos', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
    /***/
  },

  /***/
  "./src/app/todos/components/footer/footer.component.ts":
  /*!*************************************************************!*\
    !*** ./src/app/todos/components/footer/footer.component.ts ***!
    \*************************************************************/

  /*! exports provided: FooterComponent */

  /***/
  function srcAppTodosComponentsFooterFooterComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "FooterComponent", function () {
      return FooterComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");

    var FooterComponent = /*#__PURE__*/function () {
      function FooterComponent() {
        _classCallCheck(this, FooterComponent);
      }

      _createClass(FooterComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }]);

      return FooterComponent;
    }();

    FooterComponent.ɵfac = function FooterComponent_Factory(t) {
      return new (t || FooterComponent)();
    };

    FooterComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: FooterComponent,
      selectors: [["app-footer"]],
      inputs: {
        countTodos: "countTodos",
        currentFilter: "currentFilter"
      },
      decls: 13,
      vars: 7,
      consts: [["id", "footer", 1, "footer"], ["id", "todo-count", 1, "todo-count"], ["id", "filters", 1, "filters"], ["routerLink", "/"], ["routerLink", "/active"], ["routerLink", "/completed"]],
      template: function FooterComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "footer", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "span", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "ul", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "li");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, " All ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "li");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "a", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, " Active ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "li");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "a", 5);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, " Completed ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx.countTodos, " items left");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("selected", ctx.currentFilter == "all");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("selected", ctx.currentFilter == "active");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("selected", ctx.currentFilter == "completed");
        }
      },
      directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]],
      encapsulation: 2,
      changeDetection: 0
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FooterComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-footer',
          templateUrl: './footer.component.html',
          changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }]
      }], function () {
        return [];
      }, {
        countTodos: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        currentFilter: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/todos/components/index.ts":
  /*!*******************************************!*\
    !*** ./src/app/todos/components/index.ts ***!
    \*******************************************/

  /*! exports provided: COMPONENTS */

  /***/
  function srcAppTodosComponentsIndexTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "COMPONENTS", function () {
      return COMPONENTS;
    });
    /* harmony import */


    var _footer_footer_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./footer/footer.component */
    "./src/app/todos/components/footer/footer.component.ts");
    /* harmony import */


    var _new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./new-todo/new-todo.component */
    "./src/app/todos/components/new-todo/new-todo.component.ts");
    /* harmony import */


    var _todo_todo_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./todo/todo.component */
    "./src/app/todos/components/todo/todo.component.ts");

    var COMPONENTS = [_footer_footer_component__WEBPACK_IMPORTED_MODULE_0__["FooterComponent"], _new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_1__["NewTodoComponent"], _todo_todo_component__WEBPACK_IMPORTED_MODULE_2__["TodoComponent"]];
    /***/
  },

  /***/
  "./src/app/todos/components/new-todo/new-todo.component.ts":
  /*!*****************************************************************!*\
    !*** ./src/app/todos/components/new-todo/new-todo.component.ts ***!
    \*****************************************************************/

  /*! exports provided: NewTodoComponent */

  /***/
  function srcAppTodosComponentsNewTodoNewTodoComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "NewTodoComponent", function () {
      return NewTodoComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
    /* harmony import */


    var _utils_validators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @utils/validators */
    "./src/app/utils/validators.ts");

    var NewTodoComponent = /*#__PURE__*/function () {
      function NewTodoComponent() {
        _classCallCheck(this, NewTodoComponent);

        this.saveTodo = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.textField = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _utils_validators__WEBPACK_IMPORTED_MODULE_2__["CustomValidators"].isBlank]);
      }

      _createClass(NewTodoComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }, {
        key: "addTodo",
        value: function addTodo() {
          if (this.textField.valid) {
            var text = this.textField.value;
            this.textField.setValue('', {
              emitEvent: false
            });
            this.saveTodo.emit(text);
          }
        }
      }]);

      return NewTodoComponent;
    }();

    NewTodoComponent.ɵfac = function NewTodoComponent_Factory(t) {
      return new (t || NewTodoComponent)();
    };

    NewTodoComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: NewTodoComponent,
      selectors: [["app-new-todo"]],
      outputs: {
        saveTodo: "saveTodo"
      },
      decls: 1,
      vars: 1,
      consts: [["id", "new-todo", "type", "text", "autofocus", "", "placeholder", "What needs to be done?", 1, "new-todo", 3, "formControl", "keyup.enter"]],
      template: function NewTodoComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "input", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keyup.enter", function NewTodoComponent_Template_input_keyup_enter_0_listener() {
            return ctx.addTodo();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx.textField);
        }
      },
      directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlDirective"]],
      encapsulation: 2,
      changeDetection: 0
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NewTodoComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-new-todo',
          templateUrl: './new-todo.component.html',
          changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }]
      }], function () {
        return [];
      }, {
        saveTodo: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/todos/components/todo/todo.component.ts":
  /*!*********************************************************!*\
    !*** ./src/app/todos/components/todo/todo.component.ts ***!
    \*********************************************************/

  /*! exports provided: TodoComponent */

  /***/
  function srcAppTodosComponentsTodoTodoComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TodoComponent", function () {
      return TodoComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
    /* harmony import */


    var _app_utils_validators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @app/utils/validators */
    "./src/app/utils/validators.ts");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");

    var _c0 = ["textInput"];

    var _c1 = function _c1(a1) {
      return ["/detail", a1];
    };

    var TodoComponent = /*#__PURE__*/function () {
      function TodoComponent() {
        var _this = this;

        _classCallCheck(this, TodoComponent);

        this.update = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this["delete"] = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.textField = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _app_utils_validators__WEBPACK_IMPORTED_MODULE_2__["CustomValidators"].isBlank]);
        this.checkField = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](false);
        this.checkField.valueChanges.subscribe(function (state) {
          var update = {
            id: _this._todo.id,
            changes: {
              completed: state
            }
          };

          _this.update.emit(update);
        });
      }

      _createClass(TodoComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }, {
        key: "updateText",
        value: function updateText() {
          if (this.textField.valid && this.editing) {
            var update = {
              id: this._todo.id,
              changes: {
                title: this.textField.value
              }
            };
            this.update.emit(update);
            this.editing = false;
          }
        }
      }, {
        key: "activeEditMode",
        value: function activeEditMode() {
          var _this2 = this;

          this.editing = true;
          setTimeout(function () {
            _this2.textInput.nativeElement.focus();
          });
        }
      }, {
        key: "deleteTodo",
        value: function deleteTodo() {
          this["delete"].emit(this._todo.id);
        }
      }, {
        key: "todo",
        set: function set(todo) {
          this._todo = todo;
          this.textField.setValue(this._todo.title);
          this.checkField.setValue(this._todo.completed, {
            emitEvent: false
          });
        }
      }]);

      return TodoComponent;
    }();

    TodoComponent.ɵfac = function TodoComponent_Factory(t) {
      return new (t || TodoComponent)();
    };

    TodoComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: TodoComponent,
      selectors: [["app-todo"]],
      viewQuery: function TodoComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true);
        }

        if (rf & 2) {
          var _t;

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.textInput = _t.first);
        }
      },
      inputs: {
        todo: "todo"
      },
      outputs: {
        update: "update",
        "delete": "delete"
      },
      decls: 10,
      vars: 11,
      consts: [[1, "view"], ["type", "checkbox", 1, "toggle", 3, "formControl"], [3, "dblclick"], [1, "detail", 3, "routerLink"], [1, "destroy", 3, "click"], ["type", "text", 1, "edit", 3, "formControl", "hidden", "keyup.enter", "blur"], ["textInput", ""]],
      template: function TodoComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "li");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "input", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "label", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("dblclick", function TodoComponent_Template_label_dblclick_3_listener() {
            return ctx.activeEditMode();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, ">");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function TodoComponent_Template_button_click_7_listener() {
            return ctx.deleteTodo();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "input", 5, 6);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keyup.enter", function TodoComponent_Template_input_keyup_enter_8_listener() {
            return ctx.updateText();
          })("blur", function TodoComponent_Template_input_blur_8_listener() {
            return ctx.updateText();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("completed", ctx._todo.completed)("editing", ctx.editing);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx.checkField);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx._todo.title, " ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](9, _c1, ctx._todo.id));

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx.textField)("hidden", ctx.editing);
        }
      },
      directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["CheckboxControlValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlDirective"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterLinkWithHref"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"]],
      encapsulation: 2,
      changeDetection: 0
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodoComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-todo',
          templateUrl: './todo.component.html',
          changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }]
      }], function () {
        return [];
      }, {
        todo: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }],
        textInput: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
          args: ['textInput', {
            "static": true
          }]
        }],
        update: [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }],
        "delete": [{
          type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }]
      });
    })();
    /***/

  },

  /***/
  "./src/app/todos/containers/index.ts":
  /*!*******************************************!*\
    !*** ./src/app/todos/containers/index.ts ***!
    \*******************************************/

  /*! exports provided: CONTAINERS */

  /***/
  function srcAppTodosContainersIndexTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "CONTAINERS", function () {
      return CONTAINERS;
    });
    /* harmony import */


    var _layout_layout_container__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./layout/layout.container */
    "./src/app/todos/containers/layout/layout.container.ts");
    /* harmony import */


    var _todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! ./todo-list/todo-list.container */
    "./src/app/todos/containers/todo-list/todo-list.container.ts");
    /* harmony import */


    var _todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./todo-detail/todo-detail.container */
    "./src/app/todos/containers/todo-detail/todo-detail.container.ts");

    var CONTAINERS = [_layout_layout_container__WEBPACK_IMPORTED_MODULE_0__["LayoutContainer"], _todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_1__["TodoListContainer"], _todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_2__["TodoDetailContainer"]];
    /***/
  },

  /***/
  "./src/app/todos/containers/layout/layout.container.ts":
  /*!*************************************************************!*\
    !*** ./src/app/todos/containers/layout/layout.container.ts ***!
    \*************************************************************/

  /*! exports provided: LayoutContainer */

  /***/
  function srcAppTodosContainersLayoutLayoutContainerTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "LayoutContainer", function () {
      return LayoutContainer;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");
    /* harmony import */


    var _todos_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @todos/actions */
    "./src/app/todos/actions/index.ts");
    /* harmony import */


    var _todos_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @todos/selectors */
    "./src/app/todos/selectors/index.ts");
    /* harmony import */


    var _components_new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! ../../components/new-todo/new-todo.component */
    "./src/app/todos/components/new-todo/new-todo.component.ts");
    /* harmony import */


    var _todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ../todo-list/todo-list.container */
    "./src/app/todos/containers/todo-list/todo-list.container.ts");
    /* harmony import */


    var _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../../components/footer/footer.component */
    "./src/app/todos/components/footer/footer.component.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js"); // tslint:disable-next-line: component-class-suffix


    var LayoutContainer = /*#__PURE__*/function () {
      function LayoutContainer(store) {
        _classCallCheck(this, LayoutContainer);

        this.store = store;
        this.counter$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["select"])(_todos_selectors__WEBPACK_IMPORTED_MODULE_3__["getCountVisibleTodos"]));
        this.filter$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["select"])(_todos_selectors__WEBPACK_IMPORTED_MODULE_3__["getFilter"]));
      }

      _createClass(LayoutContainer, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }, {
        key: "onSaveTodo",
        value: function onSaveTodo(title) {
          var todo = {
            id: Math.floor(Math.random() * (300 - 200)) + 200,
            title: title,
            completed: false
          };
          var action = Object(_todos_actions__WEBPACK_IMPORTED_MODULE_2__["addTodoRequest"])({
            todo: todo
          });
          this.store.dispatch(action);
        }
      }]);

      return LayoutContainer;
    }();

    LayoutContainer.ɵfac = function LayoutContainer_Factory(t) {
      return new (t || LayoutContainer)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]));
    };

    LayoutContainer.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: LayoutContainer,
      selectors: [["app-layout"]],
      decls: 27,
      vars: 6,
      consts: [[1, "todoapp"], [1, "header"], [3, "saveTodo"], [3, "countTodos", "currentFilter"], [1, "info"], ["href", "http://twitter.com/nicobytes"], ["href", "https://angular.io/"], ["href", "https://ngrx.github.io/"], ["href", "http://todomvc.com"]],
      template: function LayoutContainer_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "section", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "header", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h1");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "todos");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "app-new-todo", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("saveTodo", function LayoutContainer_Template_app_new_todo_saveTodo_4_listener($event) {
            return ctx.onSaveTodo($event);
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](5, "app-todo-list");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](6, "app-footer", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](7, "async");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](8, "async");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "footer", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "p");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Double-click to edit a todo");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "p");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](13, "Written by ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "a", 5);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Nicolas Molina");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "p");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " Using ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "a", 6);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "Angular");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, " and ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "a", 7);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "ngrx/store");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "p");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, "Part of ");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "a", 8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, "TodoMVC");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("countTodos", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](7, 2, ctx.counter$))("currentFilter", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](8, 4, ctx.filter$));
        }
      },
      directives: [_components_new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_4__["NewTodoComponent"], _todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_5__["TodoListContainer"], _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_6__["FooterComponent"]],
      pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_7__["AsyncPipe"]],
      encapsulation: 2,
      changeDetection: 0
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LayoutContainer, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-layout',
          templateUrl: './layout.container.html',
          changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }]
      }], function () {
        return [{
          type: _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/todos/containers/todo-detail/todo-detail.container.ts":
  /*!***********************************************************************!*\
    !*** ./src/app/todos/containers/todo-detail/todo-detail.container.ts ***!
    \***********************************************************************/

  /*! exports provided: TodoDetailContainer */

  /***/
  function srcAppTodosContainersTodoDetailTodoDetailContainerTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TodoDetailContainer", function () {
      return TodoDetailContainer;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");
    /* harmony import */


    var _todos_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @todos/selectors */
    "./src/app/todos/selectors/index.ts");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");

    function TodoDetailContainer_section_0_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "section", 1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h1");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var todo_r1 = ctx.ngIf;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](todo_r1.title);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](todo_r1.completed);
      }
    } // tslint:disable-next-line: component-class-suffix


    var TodoDetailContainer = /*#__PURE__*/function () {
      function TodoDetailContainer(store) {
        _classCallCheck(this, TodoDetailContainer);

        this.store = store;
        this.todo$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["select"])(_todos_selectors__WEBPACK_IMPORTED_MODULE_2__["getTodo"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(function (todo) {
          return todo !== null;
        }));
      }

      _createClass(TodoDetailContainer, [{
        key: "ngOnInit",
        value: function ngOnInit() {}
      }]);

      return TodoDetailContainer;
    }();

    TodoDetailContainer.ɵfac = function TodoDetailContainer_Factory(t) {
      return new (t || TodoDetailContainer)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]));
    };

    TodoDetailContainer.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: TodoDetailContainer,
      selectors: [["app-todo-detail"]],
      decls: 2,
      vars: 3,
      consts: [["id", "main", "class", "main", 4, "ngIf"], ["id", "main", 1, "main"]],
      template: function TodoDetailContainer_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, TodoDetailContainer_section_0_Template, 5, 2, "section", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](1, "async");
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](1, 1, ctx.todo$));
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"]],
      pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["AsyncPipe"]],
      encapsulation: 2,
      changeDetection: 0
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodoDetailContainer, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-todo-detail',
          templateUrl: './todo-detail.container.html',
          changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }]
      }], function () {
        return [{
          type: _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/todos/containers/todo-list/todo-list.container.ts":
  /*!*******************************************************************!*\
    !*** ./src/app/todos/containers/todo-list/todo-list.container.ts ***!
    \*******************************************************************/

  /*! exports provided: TodoListContainer */

  /***/
  function srcAppTodosContainersTodoListTodoListContainerTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TodoListContainer", function () {
      return TodoListContainer;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");
    /* harmony import */


    var _todos_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @todos/actions */
    "./src/app/todos/actions/index.ts");
    /* harmony import */


    var _todos_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @todos/selectors */
    "./src/app/todos/selectors/index.ts");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _components_todo_todo_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ../../components/todo/todo.component */
    "./src/app/todos/components/todo/todo.component.ts");

    function TodoListContainer_section_0_app_todo_2_Template(rf, ctx) {
      if (rf & 1) {
        var _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "app-todo", 4);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("update", function TodoListContainer_section_0_app_todo_2_Template_app_todo_update_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5);

          var ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r4.onUpdate($event);
        })("delete", function TodoListContainer_section_0_app_todo_2_Template_app_todo_delete_0_listener($event) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5);

          var ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);

          return ctx_r6.onDelete($event);
        });

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var todo_r3 = ctx.$implicit;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("todo", todo_r3);
      }
    }

    function TodoListContainer_section_0_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "section", 1);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "ul", 2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, TodoListContainer_section_0_app_todo_2_Template, 1, 1, "app-todo", 3);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      }

      if (rf & 2) {
        var todos_r1 = ctx.ngIf;

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", todos_r1);
      }
    } // tslint:disable-next-line: component-class-suffix


    var TodoListContainer = /*#__PURE__*/function () {
      function TodoListContainer(store) {
        _classCallCheck(this, TodoListContainer);

        this.store = store;
        this.checkField = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](false);
        this.todos$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["select"])(_todos_selectors__WEBPACK_IMPORTED_MODULE_4__["getVisibleTodos"]));
      }

      _createClass(TodoListContainer, [{
        key: "ngOnInit",
        value: function ngOnInit() {} // TODO
        // toggleAll() {
        //  this.store.dispatch(new TodoActions.CompletedAllAction());
        // }

      }, {
        key: "onUpdate",
        value: function onUpdate(update) {
          var action = Object(_todos_actions__WEBPACK_IMPORTED_MODULE_3__["updateTodoRequest"])({
            update: update
          });
          this.store.dispatch(action);
        }
      }, {
        key: "onDelete",
        value: function onDelete(id) {
          var action = Object(_todos_actions__WEBPACK_IMPORTED_MODULE_3__["deleteTodoRequest"])({
            id: id
          });
          this.store.dispatch(action);
        }
      }]);

      return TodoListContainer;
    }();

    TodoListContainer.ɵfac = function TodoListContainer_Factory(t) {
      return new (t || TodoListContainer)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"]));
    };

    TodoListContainer.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: TodoListContainer,
      selectors: [["app-todo-list"]],
      decls: 2,
      vars: 3,
      consts: [["id", "main", "class", "main", 4, "ngIf"], ["id", "main", 1, "main"], ["id", "todo-list", 1, "todo-list"], [3, "todo", "update", "delete", 4, "ngFor", "ngForOf"], [3, "todo", "update", "delete"]],
      template: function TodoListContainer_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, TodoListContainer_section_0_Template, 3, 1, "section", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](1, "async");
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](1, 1, ctx.todos$));
        }
      },
      directives: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgForOf"], _components_todo_todo_component__WEBPACK_IMPORTED_MODULE_6__["TodoComponent"]],
      pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["AsyncPipe"]],
      encapsulation: 2,
      changeDetection: 0
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodoListContainer, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-todo-list',
          templateUrl: './todo-list.container.html',
          changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
        }]
      }], function () {
        return [{
          type: _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/todos/effects/index.ts":
  /*!****************************************!*\
    !*** ./src/app/todos/effects/index.ts ***!
    \****************************************/

  /*! exports provided: EFFECTS */

  /***/
  function srcAppTodosEffectsIndexTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "EFFECTS", function () {
      return EFFECTS;
    });
    /* harmony import */


    var _todos_effects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./todos.effects */
    "./src/app/todos/effects/todos.effects.ts");

    var EFFECTS = [_todos_effects__WEBPACK_IMPORTED_MODULE_0__["TodosEffects"]];
    /***/
  },

  /***/
  "./src/app/todos/effects/todos.effects.ts":
  /*!************************************************!*\
    !*** ./src/app/todos/effects/todos.effects.ts ***!
    \************************************************/

  /*! exports provided: TodosEffects */

  /***/
  function srcAppTodosEffectsTodosEffectsTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TodosEffects", function () {
      return TodosEffects;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @ngrx/effects */
    "./node_modules/@ngrx/effects/__ivy_ngcc__/fesm2015/effects.js");
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");
    /* harmony import */


    var _todos_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @todos/actions */
    "./src/app/todos/actions/index.ts");
    /* harmony import */


    var _todos_services_todos_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @todos/services/todos.service */
    "./src/app/todos/services/todos.service.ts");

    var TodosEffects = function TodosEffects(actions$, todosService) {
      var _this3 = this;

      _classCallCheck(this, TodosEffects);

      this.actions$ = actions$;
      this.todosService = todosService;
      this.loadTodosRequest = Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["createEffect"])(function () {
        return _this3.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["loadTodosRequest"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function () {
          return _this3.todosService.getAllTodos().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])(function (todos) {
            return [Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["loadTodos"])({
              todos: todos
            }), Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["loadTodosSuccess"])()];
          }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (error) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["loadTodosFail"])({
              error: error
            }));
          }));
        }));
      });
      this.addTodoRequest$ = Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["createEffect"])(function () {
        return _this3.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["addTodoRequest"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (action) {
          return _this3.todosService.createTodo(action.todo).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])(function (newTodo) {
            return [Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["addTodo"])({
              todo: newTodo
            }), Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["addTodoSuccess"])()];
          }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (error) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["addTodoFail"])({
              error: error
            }));
          }));
        }));
      });
      this.updateTodoRequest$ = Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["createEffect"])(function () {
        return _this3.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["updateTodoRequest"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (action) {
          var update = action.update;
          return _this3.todosService.updateTodo(update.changes).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])(function () {
            return [Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["updateTodo"])({
              update: update
            }), Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["updateTodoSuccess"])()];
          }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (error) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["updateTodoFail"])({
              error: error
            }));
          }));
        }));
      });
      this.deleteTodoRequest$ = Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["createEffect"])(function () {
        return _this3.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["deleteTodoRequest"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function (action) {
          var id = action.id;
          return _this3.todosService.deleteTodo(id).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])(function () {
            return [Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["deleteTodo"])({
              id: id
            }), Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["deleteTodoSuccess"])()];
          }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function (error) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["deleteTodoFail"])({
              error: error
            }));
          }));
        }));
      });
    };

    TodosEffects.ɵfac = function TodosEffects_Factory(t) {
      return new (t || TodosEffects)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_todos_services_todos_service__WEBPACK_IMPORTED_MODULE_5__["TodosService"]));
    };

    TodosEffects.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: TodosEffects,
      factory: TodosEffects.ɵfac
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodosEffects, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
      }], function () {
        return [{
          type: _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"]
        }, {
          type: _todos_services_todos_service__WEBPACK_IMPORTED_MODULE_5__["TodosService"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/todos/guards/index.ts":
  /*!***************************************!*\
    !*** ./src/app/todos/guards/index.ts ***!
    \***************************************/

  /*! exports provided: GUARDS */

  /***/
  function srcAppTodosGuardsIndexTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "GUARDS", function () {
      return GUARDS;
    });
    /* harmony import */


    var _todos_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./todos.guard */
    "./src/app/todos/guards/todos.guard.ts");

    var GUARDS = [_todos_guard__WEBPACK_IMPORTED_MODULE_0__["TodosGuard"]];
    /***/
  },

  /***/
  "./src/app/todos/guards/todos.guard.ts":
  /*!*********************************************!*\
    !*** ./src/app/todos/guards/todos.guard.ts ***!
    \*********************************************/

  /*! exports provided: TodosGuard */

  /***/
  function srcAppTodosGuardsTodosGuardTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TodosGuard", function () {
      return TodosGuard;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");
    /* harmony import */


    var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! rxjs */
    "./node_modules/rxjs/_esm2015/index.js");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");
    /* harmony import */


    var _todos_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @todos/selectors */
    "./src/app/todos/selectors/index.ts");
    /* harmony import */


    var _todos_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! @todos/actions */
    "./src/app/todos/actions/index.ts");

    var TodosGuard = /*#__PURE__*/function () {
      function TodosGuard(store) {
        _classCallCheck(this, TodosGuard);

        this.store = store;
      }

      _createClass(TodosGuard, [{
        key: "canActivate",
        value: function canActivate() {
          return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["forkJoin"])([this.checkTodos()]).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(function () {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(true);
          }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(function () {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(false);
          }));
        }
      }, {
        key: "checkTodos",
        value: function checkTodos() {
          var _this4 = this;

          return this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["select"])(_todos_selectors__WEBPACK_IMPORTED_MODULE_4__["getCountAllTodos"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(function (total) {
            if (total === 0) {
              _this4.dispatchLoadTodos();
            }
          }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1));
        }
      }, {
        key: "dispatchLoadTodos",
        value: function dispatchLoadTodos() {
          var action = Object(_todos_actions__WEBPACK_IMPORTED_MODULE_5__["loadTodosRequest"])();
          this.store.dispatch(action);
        }
      }]);

      return TodosGuard;
    }();

    TodosGuard.ɵfac = function TodosGuard_Factory(t) {
      return new (t || TodosGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]));
    };

    TodosGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: TodosGuard,
      factory: TodosGuard.ɵfac
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodosGuard, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
      }], function () {
        return [{
          type: _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/todos/reducers/index.ts":
  /*!*****************************************!*\
    !*** ./src/app/todos/reducers/index.ts ***!
    \*****************************************/

  /*! exports provided: reducers, metaReducers, getTodosModuleState */

  /***/
  function srcAppTodosReducersIndexTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "reducers", function () {
      return reducers;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "metaReducers", function () {
      return metaReducers;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "getTodosModuleState", function () {
      return getTodosModuleState;
    });
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");
    /* harmony import */


    var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @environments/environment */
    "./src/environments/environment.ts");
    /* harmony import */


    var _todos_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./todos.reducer */
    "./src/app/todos/reducers/todos.reducer.ts");
    /* harmony import */


    var _todos_ui_reducer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./todos-ui.reducer */
    "./src/app/todos/reducers/todos-ui.reducer.ts");

    var reducers = {
      todos: _todos_reducer__WEBPACK_IMPORTED_MODULE_2__["todosReducer"],
      todosUI: _todos_ui_reducer__WEBPACK_IMPORTED_MODULE_3__["todosUIReducer"]
    };
    var metaReducers = !_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production ? [] : [];
    var getTodosModuleState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createFeatureSelector"])('todos-module');
    /***/
  },

  /***/
  "./src/app/todos/reducers/todos-ui.reducer.ts":
  /*!****************************************************!*\
    !*** ./src/app/todos/reducers/todos-ui.reducer.ts ***!
    \****************************************************/

  /*! exports provided: initialState, todosUIReducer */

  /***/
  function srcAppTodosReducersTodosUiReducerTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "initialState", function () {
      return initialState;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "todosUIReducer", function () {
      return todosUIReducer;
    });
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");
    /* harmony import */


    var _todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @todos/actions/todos-ui.actions */
    "./src/app/todos/actions/todos-ui.actions.ts");

    var initialState = {
      loadingTodos: false,
      errorLoadingTodos: null,
      loadingAddTodo: false,
      errorAddTodo: null,
      loadingUpdateTodo: false,
      errorUpdateTodo: null,
      loadingDeleteTodo: false,
      errorDeleteTodo: null
    };
    var todosUIReducer = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createReducer"])(initialState, Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosRequest"], function (state) {
      return Object.assign(Object.assign({}, state), {
        loadingTodos: true,
        errorLoadingTodos: null
      });
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosSuccess"], function (state) {
      return Object.assign(Object.assign({}, state), {
        loadingTodos: false,
        errorLoadingTodos: null
      });
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosFail"], function (state, _ref2) {
      var error = _ref2.error;
      return Object.assign(Object.assign({}, state), {
        loadingTodos: false,
        errorLoadingTodos: error || null
      });
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["addTodoRequest"], function (state) {
      return Object.assign(Object.assign({}, state), {
        loadingAddTodo: true,
        errorAddTodo: null
      });
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosSuccess"], function (state) {
      return Object.assign(Object.assign({}, state), {
        loadingAddTodo: false,
        errorAddTodo: null
      });
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosFail"], function (state, _ref3) {
      var error = _ref3.error;
      return Object.assign(Object.assign({}, state), {
        loadingAddTodo: false,
        errorAddTodo: error || null
      });
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodoRequest"], function (state) {
      return Object.assign(Object.assign({}, state), {
        loadingUpdateTodo: true,
        errorUpdateTodo: null
      });
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodoSuccess"], function (state) {
      return Object.assign(Object.assign({}, state), {
        loadingUpdateTodo: false,
        errorUpdateTodo: null
      });
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["addTodoFail"], function (state, _ref4) {
      var error = _ref4.error;
      return Object.assign(Object.assign({}, state), {
        loadingUpdateTodo: false,
        errorUpdateTodo: error || null
      });
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoRequest"], function (state) {
      return Object.assign(Object.assign({}, state), {
        loadingDeleteTodo: true,
        errorDeleteTodo: null
      });
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoSuccess"], function (state) {
      return Object.assign(Object.assign({}, state), {
        loadingDeleteTodo: false,
        errorDeleteTodo: null
      });
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoFail"], function (state, _ref5) {
      var error = _ref5.error;
      return Object.assign(Object.assign({}, state), {
        loadingDeleteTodo: false,
        errorDeleteTodo: error || null
      });
    }));
    /***/
  },

  /***/
  "./src/app/todos/reducers/todos.reducer.ts":
  /*!*************************************************!*\
    !*** ./src/app/todos/reducers/todos.reducer.ts ***!
    \*************************************************/

  /*! exports provided: initialState, todosReducer */

  /***/
  function srcAppTodosReducersTodosReducerTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "initialState", function () {
      return initialState;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "todosReducer", function () {
      return todosReducer;
    });
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");
    /* harmony import */


    var _todos_actions_todos_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @todos/actions/todos.actions */
    "./src/app/todos/actions/todos.actions.ts");
    /* harmony import */


    var _todos_states__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @todos/states */
    "./src/app/todos/states/index.ts");

    var initialState = _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].getInitialState({// additional entity state properties
    });

    var todosReducer = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createReducer"])(initialState, Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodos"], function (state, _ref6) {
      var todos = _ref6.todos;
      return _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].setAll(todos, state);
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_actions__WEBPACK_IMPORTED_MODULE_1__["addTodo"], function (state, _ref7) {
      var todo = _ref7.todo;
      return _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].addOne(todo, state);
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodo"], function (state, _ref8) {
      var update = _ref8.update;
      return _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].updateOne(update, state);
    }), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodo"], function (state, _ref9) {
      var id = _ref9.id;
      return _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].removeOne(id, state);
    }));
    /***/
  },

  /***/
  "./src/app/todos/selectors/index.ts":
  /*!******************************************!*\
    !*** ./src/app/todos/selectors/index.ts ***!
    \******************************************/

  /*! exports provided: geTodosState, getAllTodos, getCountAllTodos, getEntitiesTodos, getVisibleTodos, getTodo, getCountVisibleTodos, getFilter */

  /***/
  function srcAppTodosSelectorsIndexTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var _todos_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./todos.selectors */
    "./src/app/todos/selectors/todos.selectors.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "geTodosState", function () {
      return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["geTodosState"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "getAllTodos", function () {
      return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getAllTodos"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "getCountAllTodos", function () {
      return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getCountAllTodos"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "getEntitiesTodos", function () {
      return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getEntitiesTodos"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "getVisibleTodos", function () {
      return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getVisibleTodos"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "getTodo", function () {
      return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getTodo"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "getCountVisibleTodos", function () {
      return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getCountVisibleTodos"];
    });
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "getFilter", function () {
      return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getFilter"];
    });
    /***/

  },

  /***/
  "./src/app/todos/selectors/todos.selectors.ts":
  /*!****************************************************!*\
    !*** ./src/app/todos/selectors/todos.selectors.ts ***!
    \****************************************************/

  /*! exports provided: geTodosState, getAllTodos, getCountAllTodos, getEntitiesTodos, getVisibleTodos, getTodo, getCountVisibleTodos, getFilter */

  /***/
  function srcAppTodosSelectorsTodosSelectorsTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "geTodosState", function () {
      return geTodosState;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "getAllTodos", function () {
      return getAllTodos;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "getCountAllTodos", function () {
      return getCountAllTodos;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "getEntitiesTodos", function () {
      return getEntitiesTodos;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "getVisibleTodos", function () {
      return getVisibleTodos;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "getTodo", function () {
      return getTodo;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "getCountVisibleTodos", function () {
      return getCountVisibleTodos;
    });
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "getFilter", function () {
      return getFilter;
    });
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");
    /* harmony import */


    var _todos_reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @todos/reducers */
    "./src/app/todos/reducers/index.ts");
    /* harmony import */


    var _todos_states__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @todos/states */
    "./src/app/todos/states/index.ts");
    /* harmony import */


    var _app_reducers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @app/reducers */
    "./src/app/reducers/index.ts");

    var geTodosState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(_todos_reducers__WEBPACK_IMPORTED_MODULE_1__["getTodosModuleState"], function (state) {
      return state.todos;
    });

    var _todos_states__WEBPAC = _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].getSelectors(geTodosState),
        getAllTodos = _todos_states__WEBPAC.selectAll,
        getCountAllTodos = _todos_states__WEBPAC.selectTotal,
        getEntitiesTodos = _todos_states__WEBPAC.selectEntities;

    var getVisibleTodos = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getAllTodos, _app_reducers__WEBPACK_IMPORTED_MODULE_3__["getRouterState"], function (todos, router) {
      var _a;

      if ((_a = router === null || router === void 0 ? void 0 : router.state) === null || _a === void 0 ? void 0 : _a.params) {
        var filter = router.state.params.filter;

        switch (filter) {
          default:
            return todos;

          case 'completed':
            return todos.filter(function (t) {
              return t.completed;
            });

          case 'active':
            return todos.filter(function (t) {
              return !t.completed;
            });
        }
      }

      return todos;
    });
    var getTodo = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getEntitiesTodos, _app_reducers__WEBPACK_IMPORTED_MODULE_3__["getRouterState"], function (entities, router) {
      var _a;

      if ((_a = router === null || router === void 0 ? void 0 : router.state) === null || _a === void 0 ? void 0 : _a.params) {
        var id = router.state.params.id;
        return entities[id];
      }

      return null;
    });
    var getCountVisibleTodos = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getVisibleTodos, function (todos) {
      return todos.length;
    });
    var getFilter = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(_app_reducers__WEBPACK_IMPORTED_MODULE_3__["getRouterState"], function (router) {
      if (router.state && router.state.params.filter) {
        var filter = router.state.params.filter;

        switch (filter) {
          default:
            return 'all';

          case 'completed':
            return 'completed';

          case 'active':
            return 'active';
        }
      }

      return 'all';
    });
    /***/
  },

  /***/
  "./src/app/todos/services/index.ts":
  /*!*****************************************!*\
    !*** ./src/app/todos/services/index.ts ***!
    \*****************************************/

  /*! exports provided: SERVICES */

  /***/
  function srcAppTodosServicesIndexTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "SERVICES", function () {
      return SERVICES;
    });
    /* harmony import */


    var _todos_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./todos.service */
    "./src/app/todos/services/todos.service.ts");

    var SERVICES = [_todos_service__WEBPACK_IMPORTED_MODULE_0__["TodosService"]];
    /***/
  },

  /***/
  "./src/app/todos/services/todos.service.ts":
  /*!*************************************************!*\
    !*** ./src/app/todos/services/todos.service.ts ***!
    \*************************************************/

  /*! exports provided: TodosService */

  /***/
  function srcAppTodosServicesTodosServiceTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TodosService", function () {
      return TodosService;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/common/http */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/http.js");
    /* harmony import */


    var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! rxjs/operators */
    "./node_modules/rxjs/_esm2015/operators/index.js");

    var TodosService = /*#__PURE__*/function () {
      function TodosService(apiUrl, http) {
        _classCallCheck(this, TodosService);

        this.apiUrl = apiUrl;
        this.http = http;
      }

      _createClass(TodosService, [{
        key: "getAllTodos",
        value: function getAllTodos() {
          var url = "".concat(this.apiUrl, "/todos");
          return this.http.get(url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (todos) {
            return todos.slice(0, 10);
          }));
        }
      }, {
        key: "createTodo",
        value: function createTodo(todo) {
          var url = "".concat(this.apiUrl, "/todos");
          return this.http.post(url, {
            todo: todo
          }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (response) {
            return response.todo;
          }));
        }
      }, {
        key: "updateTodo",
        value: function updateTodo(todo) {
          var url = "".concat(this.apiUrl, "/todos/").concat(todo.id);
          return this.http.patch(url, {
            todo: todo
          }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (response) {
            return response.todo;
          }));
        }
      }, {
        key: "deleteTodo",
        value: function deleteTodo(id) {
          var url = "".concat(this.apiUrl, "/todos/").concat(id);
          return this.http["delete"](url).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(function (response) {
            return response.todo;
          }));
        }
      }]);

      return TodosService;
    }();

    TodosService.ɵfac = function TodosService_Factory(t) {
      return new (t || TodosService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"]('API_URL'), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]));
    };

    TodosService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: TodosService,
      factory: TodosService.ɵfac
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodosService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
      }], function () {
        return [{
          type: undefined,
          decorators: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
            args: ['API_URL']
          }]
        }, {
          type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/todos/states/index.ts":
  /*!***************************************!*\
    !*** ./src/app/todos/states/index.ts ***!
    \***************************************/

  /*! exports provided: todosAdapter */

  /***/
  function srcAppTodosStatesIndexTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */


    var _todos_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! ./todos.state */
    "./src/app/todos/states/todos.state.ts");
    /* harmony reexport (safe) */


    __webpack_require__.d(__webpack_exports__, "todosAdapter", function () {
      return _todos_state__WEBPACK_IMPORTED_MODULE_0__["todosAdapter"];
    });
    /***/

  },

  /***/
  "./src/app/todos/states/todos.state.ts":
  /*!*********************************************!*\
    !*** ./src/app/todos/states/todos.state.ts ***!
    \*********************************************/

  /*! exports provided: todosAdapter */

  /***/
  function srcAppTodosStatesTodosStateTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "todosAdapter", function () {
      return todosAdapter;
    });
    /* harmony import */


    var _ngrx_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @ngrx/entity */
    "./node_modules/@ngrx/entity/__ivy_ngcc__/fesm2015/entity.js");

    var todosAdapter = Object(_ngrx_entity__WEBPACK_IMPORTED_MODULE_0__["createEntityAdapter"])();
    /***/
  },

  /***/
  "./src/app/todos/todos-routing.module.ts":
  /*!***********************************************!*\
    !*** ./src/app/todos/todos-routing.module.ts ***!
    \***********************************************/

  /*! exports provided: TodosRoutingModule */

  /***/
  function srcAppTodosTodosRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TodosRoutingModule", function () {
      return TodosRoutingModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _containers_layout_layout_container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./containers/layout/layout.container */
    "./src/app/todos/containers/layout/layout.container.ts");
    /* harmony import */


    var _containers_todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./containers/todo-detail/todo-detail.container */
    "./src/app/todos/containers/todo-detail/todo-detail.container.ts");
    /* harmony import */


    var _todos_guards_todos_guard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @todos/guards/todos.guard */
    "./src/app/todos/guards/todos.guard.ts");

    var routes = [{
      path: '',
      component: _containers_layout_layout_container__WEBPACK_IMPORTED_MODULE_2__["LayoutContainer"],
      canActivate: [_todos_guards_todos_guard__WEBPACK_IMPORTED_MODULE_4__["TodosGuard"]]
    }, {
      path: ':filter',
      component: _containers_layout_layout_container__WEBPACK_IMPORTED_MODULE_2__["LayoutContainer"],
      canActivate: [_todos_guards_todos_guard__WEBPACK_IMPORTED_MODULE_4__["TodosGuard"]]
    }, {
      path: 'detail/:id',
      component: _containers_todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_3__["TodoDetailContainer"]
    }];

    var TodosRoutingModule = function TodosRoutingModule() {
      _classCallCheck(this, TodosRoutingModule);
    };

    TodosRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: TodosRoutingModule
    });
    TodosRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function TodosRoutingModule_Factory(t) {
        return new (t || TodosRoutingModule)();
      },
      imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](TodosRoutingModule, {
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodosRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
          exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/todos/todos.module.ts":
  /*!***************************************!*\
    !*** ./src/app/todos/todos.module.ts ***!
    \***************************************/

  /*! exports provided: TodosModule */

  /***/
  function srcAppTodosTodosModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "TodosModule", function () {
      return TodosModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");
    /* harmony import */


    var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @ngrx/store */
    "./node_modules/@ngrx/store/__ivy_ngcc__/fesm2015/store.js");
    /* harmony import */


    var _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @ngrx/effects */
    "./node_modules/@ngrx/effects/__ivy_ngcc__/fesm2015/effects.js");
    /* harmony import */


    var _todos_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
    /*! ./todos-routing.module */
    "./src/app/todos/todos-routing.module.ts");
    /* harmony import */


    var _components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
    /*! ./components */
    "./src/app/todos/components/index.ts");
    /* harmony import */


    var _containers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
    /*! ./containers */
    "./src/app/todos/containers/index.ts");
    /* harmony import */


    var _reducers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
    /*! ./reducers */
    "./src/app/todos/reducers/index.ts");
    /* harmony import */


    var _services__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(
    /*! ./services */
    "./src/app/todos/services/index.ts");
    /* harmony import */


    var _effects__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(
    /*! ./effects */
    "./src/app/todos/effects/index.ts");
    /* harmony import */


    var _guards__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(
    /*! ./guards */
    "./src/app/todos/guards/index.ts");
    /* harmony import */


    var _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(
    /*! ./components/footer/footer.component */
    "./src/app/todos/components/footer/footer.component.ts");
    /* harmony import */


    var _components_new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(
    /*! ./components/new-todo/new-todo.component */
    "./src/app/todos/components/new-todo/new-todo.component.ts");
    /* harmony import */


    var _components_todo_todo_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(
    /*! ./components/todo/todo.component */
    "./src/app/todos/components/todo/todo.component.ts");
    /* harmony import */


    var _containers_layout_layout_container__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(
    /*! ./containers/layout/layout.container */
    "./src/app/todos/containers/layout/layout.container.ts");
    /* harmony import */


    var _containers_todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(
    /*! ./containers/todo-list/todo-list.container */
    "./src/app/todos/containers/todo-list/todo-list.container.ts");
    /* harmony import */


    var _containers_todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(
    /*! ./containers/todo-detail/todo-detail.container */
    "./src/app/todos/containers/todo-detail/todo-detail.container.ts");

    var TodosModule = function TodosModule() {
      _classCallCheck(this, TodosModule);
    };

    TodosModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: TodosModule
    });
    TodosModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function TodosModule_Factory(t) {
        return new (t || TodosModule)();
      },
      providers: [].concat(_toConsumableArray(_services__WEBPACK_IMPORTED_MODULE_9__["SERVICES"]), _toConsumableArray(_guards__WEBPACK_IMPORTED_MODULE_11__["GUARDS"])),
      imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"], _todos_routing_module__WEBPACK_IMPORTED_MODULE_5__["TodosRoutingModule"], _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["StoreModule"].forFeature('todos-module', _reducers__WEBPACK_IMPORTED_MODULE_8__["reducers"], {
        metaReducers: _reducers__WEBPACK_IMPORTED_MODULE_8__["metaReducers"]
      }), _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__["EffectsModule"].forFeature(_effects__WEBPACK_IMPORTED_MODULE_10__["EFFECTS"])]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](TodosModule, {
        declarations: [_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_12__["FooterComponent"], _components_new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_13__["NewTodoComponent"], _components_todo_todo_component__WEBPACK_IMPORTED_MODULE_14__["TodoComponent"], _containers_layout_layout_container__WEBPACK_IMPORTED_MODULE_15__["LayoutContainer"], _containers_todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_16__["TodoListContainer"], _containers_todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_17__["TodoDetailContainer"]],
        imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"], _todos_routing_module__WEBPACK_IMPORTED_MODULE_5__["TodosRoutingModule"], _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["StoreFeatureModule"], _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__["EffectsFeatureModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodosModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"], _todos_routing_module__WEBPACK_IMPORTED_MODULE_5__["TodosRoutingModule"], _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["StoreModule"].forFeature('todos-module', _reducers__WEBPACK_IMPORTED_MODULE_8__["reducers"], {
            metaReducers: _reducers__WEBPACK_IMPORTED_MODULE_8__["metaReducers"]
          }), _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__["EffectsModule"].forFeature(_effects__WEBPACK_IMPORTED_MODULE_10__["EFFECTS"])],
          declarations: [].concat(_toConsumableArray(_components__WEBPACK_IMPORTED_MODULE_6__["COMPONENTS"]), _toConsumableArray(_containers__WEBPACK_IMPORTED_MODULE_7__["CONTAINERS"])),
          providers: [].concat(_toConsumableArray(_services__WEBPACK_IMPORTED_MODULE_9__["SERVICES"]), _toConsumableArray(_guards__WEBPACK_IMPORTED_MODULE_11__["GUARDS"]))
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/utils/validators.ts":
  /*!*************************************!*\
    !*** ./src/app/utils/validators.ts ***!
    \*************************************/

  /*! exports provided: CustomValidators */

  /***/
  function srcAppUtilsValidatorsTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "CustomValidators", function () {
      return CustomValidators;
    });

    var CustomValidators = /*#__PURE__*/function () {
      function CustomValidators() {
        _classCallCheck(this, CustomValidators);
      }

      _createClass(CustomValidators, null, [{
        key: "isBlank",
        value: function isBlank(control) {
          var value = control.value;

          if (value === null || value === '') {
            return null;
          }

          if (value.trim() === '') {
            return {
              is_blank: true
            };
          }

          return null;
        }
      }]);

      return CustomValidators;
    }();
    /***/

  }
}]);
//# sourceMappingURL=todos-todos-module-es5.js.map