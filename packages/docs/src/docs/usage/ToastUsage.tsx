import { Button, ToastProvider, useToast } from '@ensnif/design-system'

function SaveButton() {
    const toast = useToast()
    const save = () => new Promise((r) => setTimeout(r, 800))
    return (
        <Button
            onClick={() =>
                toast.promise(save(), {
                    loading: '작업지시 저장 중…',
                    success: { title: '저장했습니다', description: 'WO-2411-001' },
                    error: '저장하지 못했습니다',
                })
            }
        >
            저장
        </Button>
    )
}

export default function Example() {
    return (
        <ToastProvider placement="bottom-right">
            <SaveButton />
        </ToastProvider>
    )
}
