import Swal from 'sweetalert2';

export const swalt = Swal.mixin({
  background: '#222',
  color: '#fff',
  customClass: {
    confirmButton: 'btn btn--blue btn--swalt',
  },
});
