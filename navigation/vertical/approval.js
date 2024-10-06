import {
    mdiBallotOutline,
} from '@mdi/js'

export default [
    {
        subheader: 'Approval',
        resource: 'Public',
        action: 'read',
        accessPage: ['viewApprovalFlow'],
    },
    {
        title: 'Approval Flow',
        to: { name: 'approval' },
        icon: mdiBallotOutline,
        resource: 'Public',
        action: 'read',
        accessPage: 'viewApprovalFlow',
    },
]