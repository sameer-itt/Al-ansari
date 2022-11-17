from __future__ import unicode_literals
import frappe


def transfer_child_attachment_to_parent(doc,method=None):
	attachments = []
	if doc.docstatus != 0:
		if len(doc.expenses)>0:
			for expense in doc.expenses:
				attachments.append(expense.attachment)
				print("attachment",expense.attachment)
	if attachments:
		for attachment in attachments:
			print("url==",attachment)
			file_rec = frappe.get_doc('File',{"file_url":attachment})
			file_rec.attached_to_name = doc.name
			file_rec.save()