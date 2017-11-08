<template>
    <div>
        <slot>
            <parameters ref="all-parameters" :parameters-list='parametersList'></parameters>
            <!-- Helpers -->
            <notifications></notifications>
            <modal ref="modal" id="modal"></modal>
            <dropzone-upload ref="dropzone-modal" _target="parameters/addPhoto" _update_target="parameters/updatePhoto"></dropzone-upload>
        </slot>
    </div>
</template>

<script>
import parameters from './parameters.vue'
import modal from './modal.vue'
import dropzoneUpload from './dropzone-upload.vue'

export default {
    data() {
        return {
            
        }
    },
    props: {
        parametersList: {default: ()=> []}
    },
    components: {
        'dropzone-upload': dropzoneUpload,
        'parameters': parameters,
        'modal': modal,
    },
    mounted() {
        Helper.modal = this.$refs['modal']
        Helper.dropzoneModal = this.$refs['dropzone-modal']

        if (window.Laravel.needInstallation || window.Laravel.needMigration) {
          EventBus.fire('need-installation')
        }
    }
}
</script>