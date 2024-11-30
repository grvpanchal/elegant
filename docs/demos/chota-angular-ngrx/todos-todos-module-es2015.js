(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["todos-todos-module"],{

/***/ "+JRB":
/*!************************************************!*\
  !*** ./src/app/todos/states/todos-ui.state.ts ***!
  \************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "5J2L":
/*!*********************************************!*\
  !*** ./src/app/todos/states/todos.state.ts ***!
  \*********************************************/
/*! exports provided: todosAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "todosAdapter", function() { return todosAdapter; });
/* harmony import */ var _ngrx_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/entity */ "EVqC");

const todosAdapter = Object(_ngrx_entity__WEBPACK_IMPORTED_MODULE_0__["createEntityAdapter"])();


/***/ }),

/***/ "B/6h":
/*!************************************************!*\
  !*** ./src/app/todos/actions/todos.actions.ts ***!
  \************************************************/
/*! exports provided: addTodo, updateTodo, deleteTodo, loadTodos */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addTodo", function() { return addTodo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateTodo", function() { return updateTodo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteTodo", function() { return deleteTodo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadTodos", function() { return loadTodos; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "kt0X");

const addTodo = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] AddTodo', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
const updateTodo = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] UpdateTodo', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
const deleteTodo = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] DeleteTodo', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
const loadTodos = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] LoadTodos', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());


/***/ }),

/***/ "BNvK":
/*!*************************************************!*\
  !*** ./src/app/todos/services/todos.service.ts ***!
  \*************************************************/
/*! exports provided: TodosService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodosService", function() { return TodosService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");





class TodosService {
    constructor(apiUrl, http) {
        this.apiUrl = apiUrl;
        this.http = http;
    }
    getAllTodos() {
        const url = `${this.apiUrl}/todos`;
        return this.http.get(url)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])(todos => todos.slice(0, 10)));
    }
    createTodo(todo) {
        const url = `${this.apiUrl}/todos`;
        return this.http.post(url, { todo })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])((response) => response.todo));
    }
    updateTodo(todo) {
        const url = `${this.apiUrl}/todos/${todo.id}`;
        return this.http.patch(url, { todo })
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])((response) => response.todo));
    }
    deleteTodo(id) {
        const url = `${this.apiUrl}/todos/${id}`;
        return this.http.delete(url)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["map"])((response) => response.todo));
    }
}
TodosService.ɵfac = function TodosService_Factory(t) { return new (t || TodosService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"]('API_URL'), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"])); };
TodosService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: TodosService, factory: TodosService.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodosService, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], function () { return [{ type: undefined, decorators: [{
                type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"],
                args: ['API_URL']
            }] }, { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"] }]; }, null); })();


/***/ }),

/***/ "EVqC":
/*!*******************************************************************!*\
  !*** ./node_modules/@ngrx/entity/__ivy_ngcc__/fesm2015/entity.js ***!
  \*******************************************************************/
/*! exports provided: Dictionary, createEntityAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dictionary", function() { return Dictionary; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createEntityAdapter", function() { return createEntityAdapter; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "kt0X");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/**
 * @license NgRx 9.2.1
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
        entities: {},
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
    function getInitialState(additionalState = {}) {
        return Object.assign(getInitialEntityState(), additionalState);
    }
    return { getInitialState };
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
        const selectIds = (/**
         * @param {?} state
         * @return {?}
         */
        (state) => state.ids);
        /** @type {?} */
        const selectEntities = (/**
         * @param {?} state
         * @return {?}
         */
        (state) => state.entities);
        /** @type {?} */
        const selectAll = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectIds, selectEntities, (/**
         * @param {?} ids
         * @param {?} entities
         * @return {?}
         */
        (ids, entities) => ids.map((/**
         * @param {?} id
         * @return {?}
         */
        (id) => ((/** @type {?} */ (entities)))[id]))));
        /** @type {?} */
        const selectTotal = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectIds, (/**
         * @param {?} ids
         * @return {?}
         */
        ids => ids.length));
        if (!selectState) {
            return {
                selectIds,
                selectEntities,
                selectAll,
                selectTotal,
            };
        }
        return {
            selectIds: Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, selectIds),
            selectEntities: Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, selectEntities),
            selectAll: Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, selectAll),
            selectTotal: Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(selectState, selectTotal),
        };
    }
    return { getSelectors };
}

/**
 * @fileoverview added by tsickle
 * Generated from: modules/entity/src/state_adapter.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const DidMutate = {
    EntitiesOnly: 0,
    Both: 1,
    None: 2,
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
    return (/**
     * @template S
     * @param {?} arg
     * @param {?} state
     * @return {?}
     */
    function operation(arg, state) {
        /** @type {?} */
        const clonedEntityState = {
            ids: [...state.ids],
            entities: Object.assign({}, state.entities),
        };
        /** @type {?} */
        const didMutate = mutator(arg, clonedEntityState);
        if (didMutate === DidMutate.Both) {
            return Object.assign({}, state, clonedEntityState);
        }
        if (didMutate === DidMutate.EntitiesOnly) {
            return Object.assign(Object.assign({}, state), { entities: clonedEntityState.entities });
        }
        return state;
    });
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
    const key = selectId(entity);
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
        const key = selectIdValue(entity, selectId);
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
        let didMutate = false;
        for (const entity of entities) {
            didMutate = addOneMutably(entity, state) !== DidMutate.None || didMutate;
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
        const key = selectIdValue(entity, selectId);
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
        const keys = keysOrPredicate instanceof Array
            ? keysOrPredicate
            : state.ids.filter((/**
             * @param {?} key
             * @return {?}
             */
            (key) => keysOrPredicate(state.entities[key])));
        /** @type {?} */
        const didMutate = keys
            .filter((/**
         * @param {?} key
         * @return {?}
         */
        (key) => key in state.entities))
            .map((/**
         * @param {?} key
         * @return {?}
         */
        (key) => delete state.entities[key])).length > 0;
        if (didMutate) {
            state.ids = state.ids.filter((/**
             * @param {?} id
             * @return {?}
             */
            (id) => id in state.entities));
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
            entities: {},
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
        const original = state.entities[update.id];
        /** @type {?} */
        const updated = Object.assign({}, original, update.changes);
        /** @type {?} */
        const newKey = selectIdValue(updated, selectId);
        /** @type {?} */
        const hasNewKey = newKey !== update.id;
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
        const newKeys = {};
        updates = updates.filter((/**
         * @param {?} update
         * @return {?}
         */
        update => update.id in state.entities));
        /** @type {?} */
        const didMutateEntities = updates.length > 0;
        if (didMutateEntities) {
            /** @type {?} */
            const didMutateIds = updates.filter((/**
             * @param {?} update
             * @return {?}
             */
            update => takeNewKey(newKeys, update, state))).length > 0;
            if (didMutateIds) {
                state.ids = state.ids.map((/**
                 * @param {?} id
                 * @return {?}
                 */
                (id) => newKeys[id] || id));
                return DidMutate.Both;
            }
            else {
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
        const changes = state.ids.reduce((/**
         * @param {?} changes
         * @param {?} id
         * @return {?}
         */
        (changes, id) => {
            /** @type {?} */
            const change = map(state.entities[id]);
            if (change !== state.entities[id]) {
                changes.push({ id, changes: change });
            }
            return changes;
        }), []);
        /** @type {?} */
        const updates = changes.filter((/**
         * @param {?} __0
         * @return {?}
         */
        ({ id }) => id in state.entities));
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
        const added = [];
        /** @type {?} */
        const updated = [];
        for (const entity of entities) {
            /** @type {?} */
            const id = selectIdValue(entity, selectId);
            if (id in state.entities) {
                updated.push({ id, changes: entity });
            }
            else {
                added.push(entity);
            }
        }
        /** @type {?} */
        const didMutateByUpdated = updateManyMutably(updated, state);
        /** @type {?} */
        const didMutateByAdded = addManyMutably(added, state);
        switch (true) {
            case didMutateByAdded === DidMutate.None &&
                didMutateByUpdated === DidMutate.None:
                return DidMutate.None;
            case didMutateByAdded === DidMutate.Both ||
                didMutateByUpdated === DidMutate.Both:
                return DidMutate.Both;
            default:
                return DidMutate.EntitiesOnly;
        }
    }
    return {
        removeAll,
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
        map: createStateOperator(mapMutably),
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
    const { removeOne, removeMany, removeAll } = createUnsortedStateAdapter(selectId);
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
        const models = newModels.filter((/**
         * @param {?} model
         * @return {?}
         */
        model => !(selectIdValue(model, selectId) in state.entities)));
        if (models.length === 0) {
            return DidMutate.None;
        }
        else {
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
        const id = selectIdValue(entity, selectId);
        if (id in state.entities) {
            state.ids = state.ids.filter((/**
             * @param {?} val
             * @return {?}
             */
            (val) => val !== id));
            merge([entity], state);
            return DidMutate.Both;
        }
        else {
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
        const original = state.entities[update.id];
        /** @type {?} */
        const updated = Object.assign({}, original, update.changes);
        /** @type {?} */
        const newKey = selectIdValue(updated, selectId);
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
        const models = [];
        /** @type {?} */
        const didMutateIds = updates.filter((/**
         * @param {?} update
         * @return {?}
         */
        update => takeUpdatedModel(models, update, state))).length >
            0;
        if (models.length === 0) {
            return DidMutate.None;
        }
        else {
            /** @type {?} */
            const originalIds = state.ids;
            /** @type {?} */
            const updatedIndexes = [];
            state.ids = state.ids.filter((/**
             * @param {?} id
             * @param {?} index
             * @return {?}
             */
            (id, index) => {
                if (id in state.entities) {
                    return true;
                }
                else {
                    updatedIndexes.push(index);
                    return false;
                }
            }));
            merge(models, state);
            if (!didMutateIds &&
                updatedIndexes.every((/**
                 * @param {?} i
                 * @return {?}
                 */
                (i) => state.ids[i] === originalIds[i]))) {
                return DidMutate.EntitiesOnly;
            }
            else {
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
        const updates = state.ids.reduce((/**
         * @param {?} changes
         * @param {?} id
         * @return {?}
         */
        (changes, id) => {
            /** @type {?} */
            const change = updatesOrMap(state.entities[id]);
            if (change !== state.entities[id]) {
                changes.push({ id, changes: change });
            }
            return changes;
        }), []);
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
        const added = [];
        /** @type {?} */
        const updated = [];
        for (const entity of entities) {
            /** @type {?} */
            const id = selectIdValue(entity, selectId);
            if (id in state.entities) {
                updated.push({ id, changes: entity });
            }
            else {
                added.push(entity);
            }
        }
        /** @type {?} */
        const didMutateByUpdated = updateManyMutably(updated, state);
        /** @type {?} */
        const didMutateByAdded = addManyMutably(added, state);
        switch (true) {
            case didMutateByAdded === DidMutate.None &&
                didMutateByUpdated === DidMutate.None:
                return DidMutate.None;
            case didMutateByAdded === DidMutate.Both ||
                didMutateByUpdated === DidMutate.Both:
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
        const ids = [];
        /** @type {?} */
        let i = 0;
        /** @type {?} */
        let j = 0;
        while (i < models.length && j < state.ids.length) {
            /** @type {?} */
            const model = models[i];
            /** @type {?} */
            const modelId = selectIdValue(model, selectId);
            /** @type {?} */
            const entityId = state.ids[j];
            /** @type {?} */
            const entity = state.entities[entityId];
            if (sort(model, entity) <= 0) {
                ids.push(modelId);
                i++;
            }
            else {
                ids.push(entityId);
                j++;
            }
        }
        if (i < models.length) {
            state.ids = ids.concat(models.slice(i).map(selectId));
        }
        else {
            state.ids = ids.concat(state.ids.slice(j));
        }
        models.forEach((/**
         * @param {?} model
         * @param {?} i
         * @return {?}
         */
        (model, i) => {
            state.entities[selectId(model)] = model;
        }));
    }
    return {
        removeOne,
        removeMany,
        removeAll,
        addOne: createStateOperator(addOneMutably),
        updateOne: createStateOperator(updateOneMutably),
        upsertOne: createStateOperator(upsertOneMutably),
        addAll: createStateOperator(setAllMutably),
        setAll: createStateOperator(setAllMutably),
        setOne: createStateOperator(setOneMutably),
        addMany: createStateOperator(addManyMutably),
        updateMany: createStateOperator(updateManyMutably),
        upsertMany: createStateOperator(upsertManyMutably),
        map: createStateOperator(mapMutably),
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
function createEntityAdapter(options = {}) {
    const { selectId, sortComparer } = Object.assign({ sortComparer: false, selectId: (/**
         * @param {?} instance
         * @return {?}
         */
        (instance) => instance.id) }, options);
    /** @type {?} */
    const stateFactory = createInitialStateFactory();
    /** @type {?} */
    const selectorsFactory = createSelectorsFactory();
    /** @type {?} */
    const stateAdapter = sortComparer
        ? createSortedStateAdapter(selectId, sortComparer)
        : createUnsortedStateAdapter(selectId);
    return Object.assign(Object.assign(Object.assign({ selectId,
        sortComparer }, stateFactory), selectorsFactory), stateAdapter);
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
function DictionaryNum() { }
/**
 * @abstract
 * @template T
 */
class Dictionary {
}
/**
 * @record
 * @template T
 */
function UpdateStr() { }
if (false) {}
/**
 * @record
 * @template T
 */
function UpdateNum() { }
if (false) {}
/**
 * @record
 * @template T
 */
function EntityState() { }
if (false) {}
/**
 * @record
 * @template T
 */
function EntityDefinition() { }
if (false) {}
/**
 * @record
 * @template T
 */
function EntityStateAdapter() { }
if (false) {}
/**
 * @record
 * @template T, V
 */
function EntitySelectors() { }
if (false) {}
/**
 * @record
 * @template T
 */
function EntityAdapter() { }
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

/***/ }),

/***/ "FVuP":
/*!******************************************!*\
  !*** ./src/app/todos/selectors/index.ts ***!
  \******************************************/
/*! exports provided: geTodosState, getAllTodos, getCountAllTodos, getEntitiesTodos, getVisibleTodos, getTodo, getCountVisibleTodos, getFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _todos_selectors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./todos.selectors */ "oF5v");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "geTodosState", function() { return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["geTodosState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getAllTodos", function() { return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getAllTodos"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCountAllTodos", function() { return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getCountAllTodos"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getEntitiesTodos", function() { return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getEntitiesTodos"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getVisibleTodos", function() { return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getVisibleTodos"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getTodo", function() { return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getTodo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getCountVisibleTodos", function() { return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getCountVisibleTodos"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "getFilter", function() { return _todos_selectors__WEBPACK_IMPORTED_MODULE_0__["getFilter"]; });




/***/ }),

/***/ "FoCt":
/*!*************************************!*\
  !*** ./src/app/utils/validators.ts ***!
  \*************************************/
/*! exports provided: CustomValidators */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CustomValidators", function() { return CustomValidators; });
class CustomValidators {
    static isBlank(control) {
        const value = control.value;
        if (value === null || value === '') {
            return null;
        }
        if (value.trim() === '') {
            return { is_blank: true };
        }
        return null;
    }
}


/***/ }),

/***/ "GErn":
/*!***************************************************!*\
  !*** ./src/app/todos/actions/todos-ui.actions.ts ***!
  \***************************************************/
/*! exports provided: loadTodosRequest, loadTodosSuccess, loadTodosFail, addTodoRequest, addTodoSuccess, addTodoFail, updateTodoRequest, updateTodoSuccess, updateTodoFail, deleteTodoRequest, deleteTodoSuccess, deleteTodoFail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadTodosRequest", function() { return loadTodosRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadTodosSuccess", function() { return loadTodosSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "loadTodosFail", function() { return loadTodosFail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addTodoRequest", function() { return addTodoRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addTodoSuccess", function() { return addTodoSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addTodoFail", function() { return addTodoFail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateTodoRequest", function() { return updateTodoRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateTodoSuccess", function() { return updateTodoSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateTodoFail", function() { return updateTodoFail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteTodoRequest", function() { return deleteTodoRequest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteTodoSuccess", function() { return deleteTodoSuccess; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deleteTodoFail", function() { return deleteTodoFail; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "kt0X");

const loadTodosRequest = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] LoadTodosRequest');
const loadTodosSuccess = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] LoadTodosSuccess');
const loadTodosFail = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] LoadTodosFail', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
const addTodoRequest = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] AddTodoRequest', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
const addTodoSuccess = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] AddTodoSuccess');
const addTodoFail = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] AddTodoFail', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
const updateTodoRequest = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] UpdateTodoRequest', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
const updateTodoSuccess = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] updateTodoSuccess');
const updateTodoFail = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] UpdateTodoFail', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
const deleteTodoRequest = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] DeleteTodoRequest', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());
const deleteTodoSuccess = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] DeleteTodoSuccess');
const deleteTodoFail = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createAction"])('[TodoModule] DeleteTodoFail', Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["props"])());


/***/ }),

/***/ "HvR+":
/*!*************************************************************!*\
  !*** ./src/app/todos/components/footer/footer.component.ts ***!
  \*************************************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");



class FooterComponent {
    constructor() {
    }
    ngOnInit() {
    }
}
FooterComponent.ɵfac = function FooterComponent_Factory(t) { return new (t || FooterComponent)(); };
FooterComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: FooterComponent, selectors: [["app-footer"]], inputs: { countTodos: "countTodos", currentFilter: "currentFilter" }, decls: 13, vars: 7, consts: [["id", "footer", 1, "footer"], ["id", "todo-count", 1, "todo-count"], ["id", "filters", 1, "filters"], ["routerLink", "/"], ["routerLink", "/active"], ["routerLink", "/completed"]], template: function FooterComponent_Template(rf, ctx) { if (rf & 1) {
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
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", ctx.countTodos, " items left");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("selected", ctx.currentFilter == "all");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("selected", ctx.currentFilter == "active");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("selected", ctx.currentFilter == "completed");
    } }, directives: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterLinkWithHref"]], encapsulation: 2, changeDetection: 0 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](FooterComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-footer',
                templateUrl: './footer.component.html',
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush
            }]
    }], function () { return []; }, { countTodos: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], currentFilter: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }] }); })();


/***/ }),

/***/ "Ms5Y":
/*!*****************************************!*\
  !*** ./src/app/todos/reducers/index.ts ***!
  \*****************************************/
/*! exports provided: reducers, metaReducers, getTodosModuleState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reducers", function() { return reducers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "metaReducers", function() { return metaReducers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTodosModuleState", function() { return getTodosModuleState; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "kt0X");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @environments/environment */ "AytR");
/* harmony import */ var _todos_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./todos.reducer */ "v84Q");
/* harmony import */ var _todos_ui_reducer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./todos-ui.reducer */ "SlOp");




const reducers = {
    todos: _todos_reducer__WEBPACK_IMPORTED_MODULE_2__["todosReducer"],
    todosUI: _todos_ui_reducer__WEBPACK_IMPORTED_MODULE_3__["todosUIReducer"]
};
const metaReducers = !_environments_environment__WEBPACK_IMPORTED_MODULE_1__["environment"].production ? [] : [];
const getTodosModuleState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createFeatureSelector"])('todos-module');


/***/ }),

/***/ "NIkG":
/*!*****************************************!*\
  !*** ./src/app/todos/services/index.ts ***!
  \*****************************************/
/*! exports provided: SERVICES */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SERVICES", function() { return SERVICES; });
/* harmony import */ var _todos_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./todos.service */ "BNvK");

const SERVICES = [
    _todos_service__WEBPACK_IMPORTED_MODULE_0__["TodosService"]
];


/***/ }),

/***/ "P8oW":
/*!*******************************************************************!*\
  !*** ./src/app/todos/containers/todo-list/todo-list.container.ts ***!
  \*******************************************************************/
/*! exports provided: TodoListContainer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodoListContainer", function() { return TodoListContainer; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/store */ "kt0X");
/* harmony import */ var _todos_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @todos/actions */ "idvC");
/* harmony import */ var _todos_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @todos/selectors */ "FVuP");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _components_todo_todo_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/todo/todo.component */ "Q2JR");









function TodoListContainer_section_0_app_todo_2_Template(rf, ctx) { if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "app-todo", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("update", function TodoListContainer_section_0_app_todo_2_Template_app_todo_update_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5); const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r4.onUpdate($event); })("delete", function TodoListContainer_section_0_app_todo_2_Template_app_todo_delete_0_listener($event) { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r5); const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2); return ctx_r6.onDelete($event); });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const todo_r3 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("todo", todo_r3);
} }
function TodoListContainer_section_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "section", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "ul", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, TodoListContainer_section_0_app_todo_2_Template, 1, 1, "app-todo", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const todos_r1 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", todos_r1);
} }
// tslint:disable-next-line: component-class-suffix
class TodoListContainer {
    constructor(store) {
        this.store = store;
        this.checkField = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](false);
        this.todos$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["select"])(_todos_selectors__WEBPACK_IMPORTED_MODULE_4__["getVisibleTodos"]));
    }
    ngOnInit() {
    }
    // TODO
    // toggleAll() {
    //  this.store.dispatch(new TodoActions.CompletedAllAction());
    // }
    onUpdate(update) {
        const action = Object(_todos_actions__WEBPACK_IMPORTED_MODULE_3__["updateTodoRequest"])({ update });
        this.store.dispatch(action);
    }
    onDelete(id) {
        const action = Object(_todos_actions__WEBPACK_IMPORTED_MODULE_3__["deleteTodoRequest"])({ id });
        this.store.dispatch(action);
    }
}
TodoListContainer.ɵfac = function TodoListContainer_Factory(t) { return new (t || TodoListContainer)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"])); };
TodoListContainer.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: TodoListContainer, selectors: [["app-todo-list"]], decls: 2, vars: 3, consts: [["id", "main", "class", "main", 4, "ngIf"], ["id", "main", 1, "main"], ["id", "todo-list", 1, "todo-list"], [3, "todo", "update", "delete", 4, "ngFor", "ngForOf"], [3, "todo", "update", "delete"]], template: function TodoListContainer_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, TodoListContainer_section_0_Template, 3, 1, "section", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](1, "async");
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](1, 1, ctx.todos$));
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["NgIf"], _angular_common__WEBPACK_IMPORTED_MODULE_5__["NgForOf"], _components_todo_todo_component__WEBPACK_IMPORTED_MODULE_6__["TodoComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_5__["AsyncPipe"]], encapsulation: 2, changeDetection: 0 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodoListContainer, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-todo-list',
                templateUrl: './todo-list.container.html',
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], function () { return [{ type: _ngrx_store__WEBPACK_IMPORTED_MODULE_2__["Store"] }]; }, null); })();


/***/ }),

/***/ "Q2JR":
/*!*********************************************************!*\
  !*** ./src/app/todos/components/todo/todo.component.ts ***!
  \*********************************************************/
/*! exports provided: TodoComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodoComponent", function() { return TodoComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _app_utils_validators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/utils/validators */ "FoCt");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "tyNb");






const _c0 = ["textInput"];
const _c1 = function (a1) { return ["/detail", a1]; };
class TodoComponent {
    constructor() {
        this.update = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.delete = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.textField = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _app_utils_validators__WEBPACK_IMPORTED_MODULE_2__["CustomValidators"].isBlank]);
        this.checkField = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](false);
        this.checkField.valueChanges
            .subscribe(state => {
            const update = {
                id: this._todo.id,
                changes: {
                    completed: state
                }
            };
            this.update.emit(update);
        });
    }
    set todo(todo) {
        this._todo = todo;
        this.textField.setValue(this._todo.title);
        this.checkField.setValue(this._todo.completed, { emitEvent: false });
    }
    ngOnInit() {
    }
    updateText() {
        if (this.textField.valid && this.editing) {
            const update = {
                id: this._todo.id,
                changes: {
                    title: this.textField.value
                }
            };
            this.update.emit(update);
            this.editing = false;
        }
    }
    activeEditMode() {
        this.editing = true;
        setTimeout(() => {
            this.textInput.nativeElement.focus();
        });
    }
    deleteTodo() {
        this.delete.emit(this._todo.id);
    }
}
TodoComponent.ɵfac = function TodoComponent_Factory(t) { return new (t || TodoComponent)(); };
TodoComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: TodoComponent, selectors: [["app-todo"]], viewQuery: function TodoComponent_Query(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstaticViewQuery"](_c0, true);
    } if (rf & 2) {
        var _t;
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.textInput = _t.first);
    } }, inputs: { todo: "todo" }, outputs: { update: "update", delete: "delete" }, decls: 10, vars: 11, consts: [[1, "view"], ["type", "checkbox", 1, "toggle", 3, "formControl"], [3, "dblclick"], [1, "detail", 3, "routerLink"], [1, "destroy", 3, "click"], ["type", "text", 1, "edit", 3, "formControl", "hidden", "keyup.enter", "blur"], ["textInput", ""]], template: function TodoComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "li");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "input", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "label", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("dblclick", function TodoComponent_Template_label_dblclick_3_listener() { return ctx.activeEditMode(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "a", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, ">");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function TodoComponent_Template_button_click_7_listener() { return ctx.deleteTodo(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "input", 5, 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keyup.enter", function TodoComponent_Template_input_keyup_enter_8_listener() { return ctx.updateText(); })("blur", function TodoComponent_Template_input_blur_8_listener() { return ctx.updateText(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("completed", ctx._todo.completed)("editing", ctx.editing);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx.checkField);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx._todo.title, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](9, _c1, ctx._todo.id));
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx.textField)("hidden", ctx.editing);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["CheckboxControlValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlDirective"], _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterLinkWithHref"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"]], encapsulation: 2, changeDetection: 0 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodoComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-todo',
                templateUrl: './todo.component.html',
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], function () { return []; }, { todo: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"]
        }], textInput: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"],
            args: ['textInput', { static: true }]
        }], update: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }], delete: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }] }); })();


/***/ }),

/***/ "Qok3":
/*!****************************************************!*\
  !*** ./src/app/todos/states/todos-module.state.ts ***!
  \****************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "SX/p":
/*!*******************************************!*\
  !*** ./src/app/todos/containers/index.ts ***!
  \*******************************************/
/*! exports provided: CONTAINERS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CONTAINERS", function() { return CONTAINERS; });
/* harmony import */ var _layout_layout_container__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./layout/layout.container */ "h35w");
/* harmony import */ var _todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./todo-list/todo-list.container */ "P8oW");
/* harmony import */ var _todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./todo-detail/todo-detail.container */ "mAo9");



const CONTAINERS = [
    _layout_layout_container__WEBPACK_IMPORTED_MODULE_0__["LayoutContainer"],
    _todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_1__["TodoListContainer"],
    _todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_2__["TodoDetailContainer"]
];


/***/ }),

/***/ "SlOp":
/*!****************************************************!*\
  !*** ./src/app/todos/reducers/todos-ui.reducer.ts ***!
  \****************************************************/
/*! exports provided: initialState, todosUIReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialState", function() { return initialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "todosUIReducer", function() { return todosUIReducer; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "kt0X");
/* harmony import */ var _todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @todos/actions/todos-ui.actions */ "GErn");


const initialState = {
    loadingTodos: false,
    errorLoadingTodos: null,
    loadingAddTodo: false,
    errorAddTodo: null,
    loadingUpdateTodo: false,
    errorUpdateTodo: null,
    loadingDeleteTodo: false,
    errorDeleteTodo: null,
};
const todosUIReducer = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createReducer"])(initialState, Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosRequest"], (state) => {
    return Object.assign(Object.assign({}, state), { loadingTodos: true, errorLoadingTodos: null });
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosSuccess"], (state) => {
    return Object.assign(Object.assign({}, state), { loadingTodos: false, errorLoadingTodos: null });
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosFail"], (state, { error }) => {
    return Object.assign(Object.assign({}, state), { loadingTodos: false, errorLoadingTodos: error || null });
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["addTodoRequest"], (state) => {
    return Object.assign(Object.assign({}, state), { loadingAddTodo: true, errorAddTodo: null });
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosSuccess"], (state) => {
    return Object.assign(Object.assign({}, state), { loadingAddTodo: false, errorAddTodo: null });
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosFail"], (state, { error }) => {
    return Object.assign(Object.assign({}, state), { loadingAddTodo: false, errorAddTodo: error || null });
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodoRequest"], (state) => {
    return Object.assign(Object.assign({}, state), { loadingUpdateTodo: true, errorUpdateTodo: null });
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodoSuccess"], (state) => {
    return Object.assign(Object.assign({}, state), { loadingUpdateTodo: false, errorUpdateTodo: null });
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["addTodoFail"], (state, { error }) => {
    return Object.assign(Object.assign({}, state), { loadingUpdateTodo: false, errorUpdateTodo: error || null });
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoRequest"], (state) => {
    return Object.assign(Object.assign({}, state), { loadingDeleteTodo: true, errorDeleteTodo: null });
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoSuccess"], (state) => {
    return Object.assign(Object.assign({}, state), { loadingDeleteTodo: false, errorDeleteTodo: null });
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoFail"], (state, { error }) => {
    return Object.assign(Object.assign({}, state), { loadingDeleteTodo: false, errorDeleteTodo: error || null });
}));


/***/ }),

/***/ "Tx2r":
/*!***************************************!*\
  !*** ./src/app/todos/states/index.ts ***!
  \***************************************/
/*! exports provided: todosAdapter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _todos_state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./todos.state */ "5J2L");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "todosAdapter", function() { return _todos_state__WEBPACK_IMPORTED_MODULE_0__["todosAdapter"]; });

/* harmony import */ var _todos_ui_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./todos-ui.state */ "+JRB");
/* empty/unused harmony star reexport *//* harmony import */ var _todos_module_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./todos-module.state */ "Qok3");
/* empty/unused harmony star reexport */




/***/ }),

/***/ "XUSM":
/*!*****************************************************************!*\
  !*** ./src/app/todos/components/new-todo/new-todo.component.ts ***!
  \*****************************************************************/
/*! exports provided: NewTodoComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NewTodoComponent", function() { return NewTodoComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _utils_validators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @utils/validators */ "FoCt");





class NewTodoComponent {
    constructor() {
        this.saveTodo = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.textField = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _utils_validators__WEBPACK_IMPORTED_MODULE_2__["CustomValidators"].isBlank]);
    }
    ngOnInit() {
    }
    addTodo() {
        if (this.textField.valid) {
            const text = this.textField.value;
            this.textField.setValue('', { emitEvent: false });
            this.saveTodo.emit(text);
        }
    }
}
NewTodoComponent.ɵfac = function NewTodoComponent_Factory(t) { return new (t || NewTodoComponent)(); };
NewTodoComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NewTodoComponent, selectors: [["app-new-todo"]], outputs: { saveTodo: "saveTodo" }, decls: 1, vars: 1, consts: [["id", "new-todo", "type", "text", "autofocus", "", "placeholder", "What needs to be done?", 1, "new-todo", 3, "formControl", "keyup.enter"]], template: function NewTodoComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "input", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keyup.enter", function NewTodoComponent_Template_input_keyup_enter_0_listener() { return ctx.addTodo(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formControl", ctx.textField);
    } }, directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControlDirective"]], encapsulation: 2, changeDetection: 0 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NewTodoComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-new-todo',
                templateUrl: './new-todo.component.html',
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], function () { return []; }, { saveTodo: [{
            type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"]
        }] }); })();


/***/ }),

/***/ "YJ73":
/*!*********************************************!*\
  !*** ./src/app/todos/guards/todos.guard.ts ***!
  \*********************************************/
/*! exports provided: TodosGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodosGuard", function() { return TodosGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "kt0X");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _todos_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @todos/selectors */ "FVuP");
/* harmony import */ var _todos_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @todos/actions */ "idvC");








class TodosGuard {
    constructor(store) {
        this.store = store;
    }
    canActivate() {
        return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["forkJoin"])([
            this.checkTodos(),
        ])
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(() => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(true)), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(() => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(false)));
    }
    checkTodos() {
        return this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["select"])(_todos_selectors__WEBPACK_IMPORTED_MODULE_4__["getCountAllTodos"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(total => {
            if (total === 0) {
                this.dispatchLoadTodos();
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1));
    }
    dispatchLoadTodos() {
        const action = Object(_todos_actions__WEBPACK_IMPORTED_MODULE_5__["loadTodosRequest"])();
        this.store.dispatch(action);
    }
}
TodosGuard.ɵfac = function TodosGuard_Factory(t) { return new (t || TodosGuard)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"])); };
TodosGuard.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: TodosGuard, factory: TodosGuard.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodosGuard, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], function () { return [{ type: _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"] }]; }, null); })();


/***/ }),

/***/ "Zh1/":
/*!***********************************************!*\
  !*** ./src/app/todos/todos-routing.module.ts ***!
  \***********************************************/
/*! exports provided: TodosRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodosRoutingModule", function() { return TodosRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _containers_layout_layout_container__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./containers/layout/layout.container */ "h35w");
/* harmony import */ var _containers_todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./containers/todo-detail/todo-detail.container */ "mAo9");
/* harmony import */ var _todos_guards_todos_guard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @todos/guards/todos.guard */ "YJ73");







const routes = [
    {
        path: '',
        component: _containers_layout_layout_container__WEBPACK_IMPORTED_MODULE_2__["LayoutContainer"],
        canActivate: [_todos_guards_todos_guard__WEBPACK_IMPORTED_MODULE_4__["TodosGuard"]]
    },
    {
        path: ':filter',
        component: _containers_layout_layout_container__WEBPACK_IMPORTED_MODULE_2__["LayoutContainer"],
        canActivate: [_todos_guards_todos_guard__WEBPACK_IMPORTED_MODULE_4__["TodosGuard"]]
    },
    {
        path: 'detail/:id',
        component: _containers_todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_3__["TodoDetailContainer"],
    }
];
class TodosRoutingModule {
}
TodosRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: TodosRoutingModule });
TodosRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function TodosRoutingModule_Factory(t) { return new (t || TodosRoutingModule)(); }, imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](TodosRoutingModule, { imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]], exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodosRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
                exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
            }]
    }], null, null); })();


/***/ }),

/***/ "aGCt":
/*!***************************************!*\
  !*** ./src/app/todos/guards/index.ts ***!
  \***************************************/
/*! exports provided: GUARDS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GUARDS", function() { return GUARDS; });
/* harmony import */ var _todos_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./todos.guard */ "YJ73");

const GUARDS = [
    _todos_guard__WEBPACK_IMPORTED_MODULE_0__["TodosGuard"]
];


/***/ }),

/***/ "h35w":
/*!*************************************************************!*\
  !*** ./src/app/todos/containers/layout/layout.container.ts ***!
  \*************************************************************/
/*! exports provided: LayoutContainer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LayoutContainer", function() { return LayoutContainer; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "kt0X");
/* harmony import */ var _todos_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @todos/actions */ "idvC");
/* harmony import */ var _todos_selectors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @todos/selectors */ "FVuP");
/* harmony import */ var _components_new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/new-todo/new-todo.component */ "XUSM");
/* harmony import */ var _todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../todo-list/todo-list.container */ "P8oW");
/* harmony import */ var _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/footer/footer.component */ "HvR+");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ "ofXK");










// tslint:disable-next-line: component-class-suffix
class LayoutContainer {
    constructor(store) {
        this.store = store;
        this.counter$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["select"])(_todos_selectors__WEBPACK_IMPORTED_MODULE_3__["getCountVisibleTodos"]));
        this.filter$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["select"])(_todos_selectors__WEBPACK_IMPORTED_MODULE_3__["getFilter"]));
    }
    ngOnInit() {
    }
    onSaveTodo(title) {
        const todo = {
            id: Math.floor(Math.random() * (300 - 200)) + 200,
            title,
            completed: false
        };
        const action = Object(_todos_actions__WEBPACK_IMPORTED_MODULE_2__["addTodoRequest"])({ todo });
        this.store.dispatch(action);
    }
}
LayoutContainer.ɵfac = function LayoutContainer_Factory(t) { return new (t || LayoutContainer)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"])); };
LayoutContainer.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: LayoutContainer, selectors: [["app-layout"]], decls: 27, vars: 6, consts: [[1, "todoapp"], [1, "header"], [3, "saveTodo"], [3, "countTodos", "currentFilter"], [1, "info"], ["href", "http://twitter.com/nicobytes"], ["href", "https://angular.io/"], ["href", "https://ngrx.github.io/"], ["href", "http://todomvc.com"]], template: function LayoutContainer_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "section", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "header", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3, "todos");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "app-new-todo", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("saveTodo", function LayoutContainer_Template_app_new_todo_saveTodo_4_listener($event) { return ctx.onSaveTodo($event); });
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
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("countTodos", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](7, 2, ctx.counter$))("currentFilter", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](8, 4, ctx.filter$));
    } }, directives: [_components_new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_4__["NewTodoComponent"], _todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_5__["TodoListContainer"], _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_6__["FooterComponent"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_7__["AsyncPipe"]], encapsulation: 2, changeDetection: 0 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](LayoutContainer, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-layout',
                templateUrl: './layout.container.html',
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], function () { return [{ type: _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"] }]; }, null); })();


/***/ }),

/***/ "idvC":
/*!****************************************!*\
  !*** ./src/app/todos/actions/index.ts ***!
  \****************************************/
/*! exports provided: addTodo, updateTodo, deleteTodo, loadTodos, loadTodosRequest, loadTodosSuccess, loadTodosFail, addTodoRequest, addTodoSuccess, addTodoFail, updateTodoRequest, updateTodoSuccess, updateTodoFail, deleteTodoRequest, deleteTodoSuccess, deleteTodoFail */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _todos_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./todos.actions */ "B/6h");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addTodo", function() { return _todos_actions__WEBPACK_IMPORTED_MODULE_0__["addTodo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "updateTodo", function() { return _todos_actions__WEBPACK_IMPORTED_MODULE_0__["updateTodo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "deleteTodo", function() { return _todos_actions__WEBPACK_IMPORTED_MODULE_0__["deleteTodo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "loadTodos", function() { return _todos_actions__WEBPACK_IMPORTED_MODULE_0__["loadTodos"]; });

/* harmony import */ var _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./todos-ui.actions */ "GErn");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "loadTodosRequest", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosRequest"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "loadTodosSuccess", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "loadTodosFail", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodosFail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addTodoRequest", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["addTodoRequest"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addTodoSuccess", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["addTodoSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "addTodoFail", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["addTodoFail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "updateTodoRequest", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodoRequest"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "updateTodoSuccess", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodoSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "updateTodoFail", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodoFail"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "deleteTodoRequest", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoRequest"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "deleteTodoSuccess", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoSuccess"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "deleteTodoFail", function() { return _todos_ui_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodoFail"]; });





/***/ }),

/***/ "mAo9":
/*!***********************************************************************!*\
  !*** ./src/app/todos/containers/todo-detail/todo-detail.container.ts ***!
  \***********************************************************************/
/*! exports provided: TodoDetailContainer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodoDetailContainer", function() { return TodoDetailContainer; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ "kt0X");
/* harmony import */ var _todos_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @todos/selectors */ "FVuP");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ "ofXK");







function TodoDetailContainer_section_0_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "section", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "h1");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
} if (rf & 2) {
    const todo_r1 = ctx.ngIf;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](todo_r1.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](todo_r1.completed);
} }
// tslint:disable-next-line: component-class-suffix
class TodoDetailContainer {
    constructor(store) {
        this.store = store;
        this.todo$ = this.store.pipe(Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["select"])(_todos_selectors__WEBPACK_IMPORTED_MODULE_2__["getTodo"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(todo => todo !== null));
    }
    ngOnInit() {
    }
}
TodoDetailContainer.ɵfac = function TodoDetailContainer_Factory(t) { return new (t || TodoDetailContainer)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"])); };
TodoDetailContainer.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: TodoDetailContainer, selectors: [["app-todo-detail"]], decls: 2, vars: 3, consts: [["id", "main", "class", "main", 4, "ngIf"], ["id", "main", 1, "main"]], template: function TodoDetailContainer_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, TodoDetailContainer_section_0_Template, 5, 2, "section", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](1, "async");
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](1, 1, ctx.todo$));
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["NgIf"]], pipes: [_angular_common__WEBPACK_IMPORTED_MODULE_4__["AsyncPipe"]], encapsulation: 2, changeDetection: 0 });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodoDetailContainer, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
                selector: 'app-todo-detail',
                templateUrl: './todo-detail.container.html',
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
            }]
    }], function () { return [{ type: _ngrx_store__WEBPACK_IMPORTED_MODULE_1__["Store"] }]; }, null); })();


/***/ }),

/***/ "oF5v":
/*!****************************************************!*\
  !*** ./src/app/todos/selectors/todos.selectors.ts ***!
  \****************************************************/
/*! exports provided: geTodosState, getAllTodos, getCountAllTodos, getEntitiesTodos, getVisibleTodos, getTodo, getCountVisibleTodos, getFilter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "geTodosState", function() { return geTodosState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAllTodos", function() { return getAllTodos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCountAllTodos", function() { return getCountAllTodos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getEntitiesTodos", function() { return getEntitiesTodos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getVisibleTodos", function() { return getVisibleTodos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTodo", function() { return getTodo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCountVisibleTodos", function() { return getCountVisibleTodos; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getFilter", function() { return getFilter; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "kt0X");
/* harmony import */ var _todos_reducers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @todos/reducers */ "Ms5Y");
/* harmony import */ var _todos_states__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @todos/states */ "Tx2r");
/* harmony import */ var _app_reducers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/reducers */ "IGZg");




const geTodosState = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(_todos_reducers__WEBPACK_IMPORTED_MODULE_1__["getTodosModuleState"], state => state.todos);
const { selectAll: getAllTodos, selectTotal: getCountAllTodos, selectEntities: getEntitiesTodos } = _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].getSelectors(geTodosState);
const getVisibleTodos = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getAllTodos, _app_reducers__WEBPACK_IMPORTED_MODULE_3__["getRouterState"], (todos, router) => {
    var _a;
    if ((_a = router === null || router === void 0 ? void 0 : router.state) === null || _a === void 0 ? void 0 : _a.params) {
        const filter = router.state.params.filter;
        switch (filter) {
            default:
                return todos;
            case 'completed':
                return todos.filter(t => t.completed);
            case 'active':
                return todos.filter(t => !t.completed);
        }
    }
    return todos;
});
const getTodo = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getEntitiesTodos, _app_reducers__WEBPACK_IMPORTED_MODULE_3__["getRouterState"], (entities, router) => {
    var _a;
    if ((_a = router === null || router === void 0 ? void 0 : router.state) === null || _a === void 0 ? void 0 : _a.params) {
        const id = router.state.params.id;
        return entities[id];
    }
    return null;
});
const getCountVisibleTodos = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(getVisibleTodos, (todos) => todos.length);
const getFilter = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createSelector"])(_app_reducers__WEBPACK_IMPORTED_MODULE_3__["getRouterState"], (router) => {
    if (router.state && router.state.params.filter) {
        const filter = router.state.params.filter;
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


/***/ }),

/***/ "qGd3":
/*!****************************************!*\
  !*** ./src/app/todos/effects/index.ts ***!
  \****************************************/
/*! exports provided: EFFECTS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EFFECTS", function() { return EFFECTS; });
/* harmony import */ var _todos_effects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./todos.effects */ "sghd");

const EFFECTS = [
    _todos_effects__WEBPACK_IMPORTED_MODULE_0__["TodosEffects"]
];


/***/ }),

/***/ "sghd":
/*!************************************************!*\
  !*** ./src/app/todos/effects/todos.effects.ts ***!
  \************************************************/
/*! exports provided: TodosEffects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodosEffects", function() { return TodosEffects; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ "snw9");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _todos_actions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @todos/actions */ "idvC");
/* harmony import */ var _todos_services_todos_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @todos/services/todos.service */ "BNvK");









class TodosEffects {
    constructor(actions$, todosService) {
        this.actions$ = actions$;
        this.todosService = todosService;
        this.loadTodosRequest = Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["createEffect"])(() => this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["loadTodosRequest"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(() => {
            return this.todosService.getAllTodos()
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((todos) => [
                Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["loadTodos"])({ todos }),
                Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["loadTodosSuccess"])(),
            ]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(error => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["loadTodosFail"])({ error }))));
        })));
        this.addTodoRequest$ = Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["createEffect"])(() => this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["addTodoRequest"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            return this.todosService.createTodo(action.todo)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])((newTodo) => [
                Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["addTodo"])({ todo: newTodo }),
                Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["addTodoSuccess"])(),
            ]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(error => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["addTodoFail"])({ error }))));
        })));
        this.updateTodoRequest$ = Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["createEffect"])(() => this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["updateTodoRequest"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const update = action.update;
            return this.todosService.updateTodo(update.changes)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])(() => [
                Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["updateTodo"])({ update }),
                Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["updateTodoSuccess"])(),
            ]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(error => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["updateTodoFail"])({ error }))));
        })));
        this.deleteTodoRequest$ = Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["createEffect"])(() => this.actions$.pipe(Object(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["ofType"])(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["deleteTodoRequest"]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])((action) => {
            const id = action.id;
            return this.todosService.deleteTodo(id)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["mergeMap"])(() => [
                Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["deleteTodo"])({ id }),
                Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["deleteTodoSuccess"])(),
            ]), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(error => Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(Object(_todos_actions__WEBPACK_IMPORTED_MODULE_4__["deleteTodoFail"])({ error }))));
        })));
    }
}
TodosEffects.ɵfac = function TodosEffects_Factory(t) { return new (t || TodosEffects)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_todos_services_todos_service__WEBPACK_IMPORTED_MODULE_5__["TodosService"])); };
TodosEffects.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: TodosEffects, factory: TodosEffects.ɵfac });
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodosEffects, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"]
    }], function () { return [{ type: _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__["Actions"] }, { type: _todos_services_todos_service__WEBPACK_IMPORTED_MODULE_5__["TodosService"] }]; }, null); })();


/***/ }),

/***/ "shMz":
/*!*******************************************!*\
  !*** ./src/app/todos/components/index.ts ***!
  \*******************************************/
/*! exports provided: COMPONENTS */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COMPONENTS", function() { return COMPONENTS; });
/* harmony import */ var _footer_footer_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./footer/footer.component */ "HvR+");
/* harmony import */ var _new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./new-todo/new-todo.component */ "XUSM");
/* harmony import */ var _todo_todo_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./todo/todo.component */ "Q2JR");



// import AlertComponent from '../../../ui/atoms/Alert/Alert.component';
// import ImageComponent from '../../../ui/atoms/Image/Image.component';
const COMPONENTS = [
    _footer_footer_component__WEBPACK_IMPORTED_MODULE_0__["FooterComponent"],
    _new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_1__["NewTodoComponent"],
    _todo_todo_component__WEBPACK_IMPORTED_MODULE_2__["TodoComponent"],
];


/***/ }),

/***/ "v84Q":
/*!*************************************************!*\
  !*** ./src/app/todos/reducers/todos.reducer.ts ***!
  \*************************************************/
/*! exports provided: initialState, todosReducer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "initialState", function() { return initialState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "todosReducer", function() { return todosReducer; });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ "kt0X");
/* harmony import */ var _todos_actions_todos_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @todos/actions/todos.actions */ "B/6h");
/* harmony import */ var _todos_states__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @todos/states */ "Tx2r");



const initialState = _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].getInitialState({
// additional entity state properties
});
const todosReducer = Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["createReducer"])(initialState, Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_actions__WEBPACK_IMPORTED_MODULE_1__["loadTodos"], (state, { todos }) => {
    return _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].setAll(todos, state);
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_actions__WEBPACK_IMPORTED_MODULE_1__["addTodo"], (state, { todo }) => {
    return _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].addOne(todo, state);
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_actions__WEBPACK_IMPORTED_MODULE_1__["updateTodo"], (state, { update }) => {
    return _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].updateOne(update, state);
}), Object(_ngrx_store__WEBPACK_IMPORTED_MODULE_0__["on"])(_todos_actions_todos_actions__WEBPACK_IMPORTED_MODULE_1__["deleteTodo"], (state, { id }) => {
    return _todos_states__WEBPACK_IMPORTED_MODULE_2__["todosAdapter"].removeOne(id, state);
}));


/***/ }),

/***/ "zrKR":
/*!***************************************!*\
  !*** ./src/app/todos/todos.module.ts ***!
  \***************************************/
/*! exports provided: TodosModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TodosModule", function() { return TodosModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/store */ "kt0X");
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/effects */ "snw9");
/* harmony import */ var _todos_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./todos-routing.module */ "Zh1/");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components */ "shMz");
/* harmony import */ var _containers__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./containers */ "SX/p");
/* harmony import */ var _reducers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./reducers */ "Ms5Y");
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./services */ "NIkG");
/* harmony import */ var _effects__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./effects */ "qGd3");
/* harmony import */ var _guards__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./guards */ "aGCt");
/* harmony import */ var _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/footer/footer.component */ "HvR+");
/* harmony import */ var _components_new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/new-todo/new-todo.component */ "XUSM");
/* harmony import */ var _components_todo_todo_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/todo/todo.component */ "Q2JR");
/* harmony import */ var _containers_layout_layout_container__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./containers/layout/layout.container */ "h35w");
/* harmony import */ var _containers_todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./containers/todo-list/todo-list.container */ "P8oW");
/* harmony import */ var _containers_todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./containers/todo-detail/todo-detail.container */ "mAo9");





















class TodosModule {
}
TodosModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({ type: TodosModule });
TodosModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({ factory: function TodosModule_Factory(t) { return new (t || TodosModule)(); }, providers: [
        ..._services__WEBPACK_IMPORTED_MODULE_9__["SERVICES"],
        ..._guards__WEBPACK_IMPORTED_MODULE_11__["GUARDS"]
    ], imports: [[
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
            _todos_routing_module__WEBPACK_IMPORTED_MODULE_5__["TodosRoutingModule"],
            _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["StoreModule"].forFeature('todos-module', _reducers__WEBPACK_IMPORTED_MODULE_8__["reducers"], {
                metaReducers: _reducers__WEBPACK_IMPORTED_MODULE_8__["metaReducers"]
            }),
            _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__["EffectsModule"].forFeature(_effects__WEBPACK_IMPORTED_MODULE_10__["EFFECTS"])
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](TodosModule, { declarations: [_components_footer_footer_component__WEBPACK_IMPORTED_MODULE_12__["FooterComponent"], _components_new_todo_new_todo_component__WEBPACK_IMPORTED_MODULE_13__["NewTodoComponent"], _components_todo_todo_component__WEBPACK_IMPORTED_MODULE_14__["TodoComponent"], _containers_layout_layout_container__WEBPACK_IMPORTED_MODULE_15__["LayoutContainer"], _containers_todo_list_todo_list_container__WEBPACK_IMPORTED_MODULE_16__["TodoListContainer"], _containers_todo_detail_todo_detail_container__WEBPACK_IMPORTED_MODULE_17__["TodoDetailContainer"]], imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
        _todos_routing_module__WEBPACK_IMPORTED_MODULE_5__["TodosRoutingModule"], _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["StoreFeatureModule"], _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__["EffectsFeatureModule"]] }); })();
/*@__PURE__*/ (function () { _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](TodosModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
                imports: [
                    _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                    _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
                    _todos_routing_module__WEBPACK_IMPORTED_MODULE_5__["TodosRoutingModule"],
                    _ngrx_store__WEBPACK_IMPORTED_MODULE_3__["StoreModule"].forFeature('todos-module', _reducers__WEBPACK_IMPORTED_MODULE_8__["reducers"], {
                        metaReducers: _reducers__WEBPACK_IMPORTED_MODULE_8__["metaReducers"]
                    }),
                    _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__["EffectsModule"].forFeature(_effects__WEBPACK_IMPORTED_MODULE_10__["EFFECTS"])
                ],
                declarations: [
                    ..._components__WEBPACK_IMPORTED_MODULE_6__["COMPONENTS"],
                    ..._containers__WEBPACK_IMPORTED_MODULE_7__["CONTAINERS"]
                ],
                providers: [
                    ..._services__WEBPACK_IMPORTED_MODULE_9__["SERVICES"],
                    ..._guards__WEBPACK_IMPORTED_MODULE_11__["GUARDS"]
                ]
            }]
    }], null, null); })();


/***/ })

}]);
//# sourceMappingURL=todos-todos-module-es2015.js.map