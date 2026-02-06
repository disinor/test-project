<template>
  <div class="main-content">
    <h3 class="me-2">
      Учетные записи
      <i @click="addNewRow()"
        class="bi bi-plus-square cursor-pointer"></i>
    </h3>
    <div>
      <!-- Статичная строка заголовков -->
      <div class="row fw-semibold text-muted pb-2 mb-2">
        <div class="col-3">
          Метки
          <Popper :hover="true"
                  placement="right">
            <i class="bi bi-question-circle cursor-pointer"></i>
            <template #content>
              <div class="popper-content">Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</div>
            </template>
          </Popper>
        </div>
        <div class="col-3">Тип записи</div>
        <template v-if="items.every(el => el.accountType?.value === 'ldap')">
          <div class="col-6">Логин</div>
        </template>
        <template v-else>
          <div class="col-3">Логин</div>
          <div class="col-3">Пароль</div>
        </template>
      </div>
      <div
        class="row py-2 position-relative"
        v-for="(item, index) in items"
        :key="item.id"
      >
        <div class="col-3">
          <input :value="getMarks(item.mark)"
                 @change="setMarks($event.srcElement?.value || '', item, v$.items.$each.$response.$errors[index])"
                 :class="{'form-error': v$.items.$each.$response.$data[index].mark.$invalid}"
                 class="form-control form-control-sm">
        </div>
        <div class="col-3">
          <select v-model="item.accountType"
                  @change="updateStore(true, v$.items.$each.$response.$errors[index])"
          class="form-control form-control-sm">
            <option v-for="type in accountTypesOptions"
                    v-text="type.label"
                    :value="type">
            </option>
          </select>
        </div>
        <div :class="item.accountType?.value === 'ldap' ? 'col-6' : 'col-3'">
          <input v-model="item.login"
                 @change="updateStore(true, v$.items.$each.$response.$errors[index])"
                 :class="{'form-error': v$.items.$each.$response.$data[index].login.$invalid}"
                 class="form-control form-control-sm">
        </div>
        <div v-if="item.accountType?.value === 'local'"
          class="col-3">
          <PasswordInput v-model="item.password"
                         @update:modelValue="updateStore(true, v$.items.$each.$response.$errors[index])"
                         :isInvalid="v$.items.$each.$response.$data[index].password.$invalid" />
        </div>
        <i @click="deleteItem(item.id)"
           class="bi bi-trash delete-button"></i>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type {AccountItem, AccountType, AccountItemValidator} from '@/components/types.ts'
import PasswordInput from './PasswordInput.vue'
import {onMounted, computed, reactive, nextTick} from 'vue'
import {uuidv4} from "@/utils.ts";
import {helpers, maxLength, required} from "@vuelidate/validators";
import {generalStore} from "@/stores/generalStore.ts";
import useVuelidate from "@vuelidate/core";

const store = generalStore()
const accountTypesOptions: AccountType[] = [
  {
    label: 'LDAP',
    value: 'ldap'
  },
  {
    label: 'Локальная',
    value: 'local'
  }
]
const items = reactive<AccountItem[]>([])
onMounted(() => {
  items.push(...store.$state.items.map(el => JSON.parse(JSON.stringify(el))))
})
const rules = computed(() => ({
  items: {
    $each: helpers.forEach({
      mark: {
        maxLength: helpers.withParams({ type: 'maxLength' },
          (_, val) => {
            const values = Object.values(val.mark)
            const str = values.map(el => el.text).join(';')
            return str.length < 50
          }
        )
      },
      login: {
        maxLength: maxLength(100),
        required: required
      },
      password: {
        maxLength: maxLength(100),
        requiredIf: helpers.withParams({ type: 'requiredIf' },
          (_, val) => {
            return val.accountType.value === 'local'
              ? val.password ? val.password.length > 0 : false
              : true
          }
        )
      }
    })
  }
}))
const v$ = useVuelidate(rules, { items })
async function addNewRow () {
  items.push({
    mark: [],
    accountType: accountTypesOptions[0],
    login: '',
    password: null,
    id: uuidv4()
  })
  await nextTick()
  updateStore(true, v$.value.items.$each.$response.$errors[items.length - 1])
}
function deleteItem (id: string) {
  const index = items.findIndex(item => item.id === id)
  if (index !== -1) {
    items.splice(index, 1)
  }
  updateStore(false, null)
}
function updateStore (needCheckValidation: boolean, obj: AccountItemValidator | null = null) {
  let isValid = false
  if (obj) {
    isValid = Object.values(obj).every(errors => !errors?.length)
  }
  if (!needCheckValidation || isValid) {
    store.$patch({
      items
    })
  }
}
function getMarks (arr: {text: string}[]) {
  const values = Object.values(arr)
  return values.map(el => el.text).join(';')
}
function setMarks (str: string, item: AccountItem, obj: AccountItemValidator) {
  item.mark = str.split(';').map(str => {
    return {
      text: str
    }
  })
  updateStore(true, obj)
}
</script>
