// Copyright (c) 2022, Indictrans and contributors
// For license information, please see license.txt

frappe.ui.form.on('Earned Leave Deductions', {
    refresh: function(frm) {
        // make negative entry in ledger
        frm.add_custom_button(__("Make Leave Allocation"), function() {
            frappe.call({
                method: "al_ansari.al_ansari.doctype.earned_leave_deductions.earned_leave_deductions.negative_ledger_entry", //dotted path to server method
                args: {
                    "frm" : frm.doc
                },
                callback: function(r) {
                    // code snippet
                    console.log(r.message)
                  
                }
            })
        });
    },
	get_employees: function(frm) {
        if(!frm.doc.from_date || !frm.doc.to_date) {
            frappe.throw("From Date and To Date should be selected to fetch Employee Records")
        }
        frm.clear_table("deduction_ratio")
		// fetch applicants from the attendance doctype whose status is 'On leave' or 'Absent'
		 frappe.call({
            method: "al_ansari.al_ansari.doctype.earned_leave_deductions.earned_leave_deductions.get_applicants", //dotted path to server method
            args: {
            	"frm" : frm.doc
            },
            callback: function(r) {
                // code snippet
                console.log(r.message)
                for(var j=0; j<r.message.length;j++){
                	var childTable = cur_frm.add_child("deduction_ratio");
                	childTable.employee_id= r.message[j].employee
                	childTable.employee_name = r.message[j].employee_name
                	// childTable.no_of_lwp = r.message[j].no_of_lwp
                	// childTable.el_allocated = r.message[j].el_allocated
                	cur_frm.refresh_fields("deduction_ratio");
                }
            }
        })
	},
    validate: function(frm) {
        if(!frm.doc.from_date || !frm.doc.to_date) {
            frappe.throw("From Date and To Date should be selected to fetch Employee Records")
        }
        if(frm.doc.deduction_ratio.length <=0) {
            frappe.throw("No records found in the Deduction Ratio table so cannot be saved")
        }
        frappe.call({
            method: "al_ansari.al_ansari.doctype.earned_leave_deductions.earned_leave_deductions.no_of_working_days_employeewise", //dotted path to server method
            args: {
                "frm" : frm.doc
            },
            callback: function(r) {
                // code snippet
                console.log(r.message)
                if(r.message.length == frm.doc.deduction_ratio.length) {
                    for(var j=0; j<frm.doc.deduction_ratio.length;j++){
                    // var childTable = cur_frm.add_child("deduction_ratio");
                    if(frm.doc.deduction_ratio[j].employee_id == r.message[j].employee)
                    frm.doc.deduction_ratio[j].no_of_working_days= r.message[j].no_of_working_days
                    frm.doc.deduction_ratio[j].el_allocated= r.message[j].el_allocated
                    frm.doc.deduction_ratio[j].no_of_lwp= r.message[j].no_of_lwp
                    frm.doc.deduction_ratio[j].deduction_ratio = frm.doc.deduction_ratio[j].no_of_lwp/r.message[j].no_of_working_days
                    frm.doc.deduction_ratio[j].to_be_deducted = frm.doc.deduction_ratio[j].el_allocated * (frm.doc.deduction_ratio[j].no_of_lwp/r.message[j].no_of_working_days)
                    frm.doc.deduction_ratio[j].to_be_allocated = frm.doc.deduction_ratio[j].el_allocated -(frm.doc.deduction_ratio[j].el_allocated * (frm.doc.deduction_ratio[j].no_of_lwp/r.message[j].no_of_working_days))                
                    cur_frm.refresh_fields("deduction_ratio");
                }
                }
                
            }
        })
    }
});