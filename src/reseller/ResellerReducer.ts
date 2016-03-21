import {List} from 'immutable';
import {Map} from 'immutable';
import * as ResellerAction from './ResellerAction';
import {PrivelegesModel} from "./PrivelegesModel";
import {Lib} from "../Lib";
const _ = require('underscore');

export function reseller(state:Map<string,any> = Map<string,any>(), action:any):Map<string,any> {

    switch (action.type) {

        case ResellerAction.RECEIVE_PRIVILEGES:
        {
            return state.setIn(['privileges'], action.privilegesModels);
        }
        case ResellerAction.RECEIVE_PRIVILEGES_SYSTEM:
        {
            return state.setIn(['privilegesSystem'], action.privelegesSystemModels);
        }
        case ResellerAction.UPDATE_PRIVILEGES:
        {
            var privileges = state.get('privileges');
            privileges.forEach((i_privelegesModel:PrivelegesModel, counter)=> {
                if (i_privelegesModel.getName() == action.payload.selPrivName) {
                    i_privelegesModel.getColumns().forEach((group, c) => {
                        if (group.get('tableName') == action.payload.tableName) {
                            var key = Lib.GetKeyFromMapIndex(group.get('columns'), action.payload.index);
                            var path = ['groups', c, 'columns', key];
                            var data = i_privelegesModel.getData().updateIn(path, v=> action.payload.updTotalBits)
                            var updPriv = i_privelegesModel.setData<PrivelegesModel>(PrivelegesModel, data);
                            privileges = privileges.set(counter, updPriv);
                        }
                    })
                }
            })
            return state.setIn(['privileges'], privileges);
        }
        default:
            return state;
    }
}