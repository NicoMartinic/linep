import React from 'react';
import { useSelector } from 'react-redux';
import ErrorPermission from '../components/common/error-permission/error-permission';

function PermissionDecorator(props) {

    const modulesActionsPermissions = useSelector(state => state.modulesActionsPermissions);
    const modules = useSelector(state => state.modules);

    const userHasPermission = () => {
        if (props.permission && modulesActionsPermissions.includes(props.permission)){
            return true;
        }
        else if (props.module){
            let module_tree = props.module.split("_");
            if (module_tree.length > 0){
                let m = modules.find(m => m.name === module_tree[0])
                if (m){
                    if (module_tree.length > 1){
                        let s_m = m.submodules.find(s => s.name === module_tree[1])
                        if (s_m){
                            return true;
                        }
                    }
                    else {
                        return true;
                    }
                }
            }


        }
        return false;
    }

    return (
        userHasPermission() ?
            props.children
        :   props.showError ?
            <ErrorPermission />
        : ''
    );
}

export default PermissionDecorator;
